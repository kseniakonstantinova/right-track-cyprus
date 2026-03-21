#!/usr/bin/env python3

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"
OUTPUT_DIR = ROOT / "tools" / "site-qa" / "output"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


def local_path_to_url(path: Path, site_url: str) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return f"{site_url}/"
    return f"{site_url}/{rel}"


def url_to_local_path(url: str, site_url: str) -> Optional[Path]:
    if not url.startswith(site_url):
        return None
    tail = url[len(site_url):]
    if tail in ("", "/"):
        return ROOT / "index.html"
    return ROOT / tail.lstrip("/")


def infer_language(path: Path, pair_suffix: str) -> str:
    return "el" if path.stem.endswith(pair_suffix) or path.name == "index-el.html" else "en"


def expected_pair(path: Path, pair_suffix: str) -> Optional[Path]:
    if path == ROOT / "index.html":
        return ROOT / "index-el.html"
    if path == ROOT / "index-el.html":
        return ROOT / "index.html"
    if path.stem.endswith(pair_suffix):
        return path.with_name(path.name.replace(f"{pair_suffix}.html", ".html"))
    if path.suffix == ".html":
        return path.with_name(path.stem + pair_suffix + path.suffix)
    return None


def classify_page(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel in ("index.html", "index-el.html"):
        return "home"
    if rel.startswith("pages/services/"):
        return "service"
    if rel.startswith("pages/blog/"):
        return "blog-article"
    if rel in ("pages/blog.html", "pages/blog-el.html"):
        return "blog-index"
    if "profile" in rel:
        return "profile"
    if any(name in rel for name in ("privacy", "terms", "cookies", "disclaimer")):
        return "legal"
    if any(name in rel for name in ("camp", "seminar", "partnership", "community")):
        return "event-or-campaign"
    return "page"


def normalize_url(value: str) -> str:
    return value.strip()


def is_external_like(url: str) -> bool:
    return (
        not url
        or url.startswith("#")
        or url.startswith("mailto:")
        or url.startswith("tel:")
        or url.startswith("javascript:")
        or url.startswith("data:")
        or url.startswith("http://")
        or url.startswith("https://")
        or url.startswith("//")
    )


def resolve_local_reference(page: Path, ref: str) -> Optional[Path]:
    if is_external_like(ref):
        return None
    clean = ref.split("#", 1)[0].split("?", 1)[0]
    if not clean:
        return None
    if clean.startswith("/"):
        return ROOT / clean.lstrip("/")
    return (page.parent / clean).resolve()


@dataclass
class PageData:
    path: Path
    language: str
    page_type: str
    title: Optional[str] = None
    title_count: int = 0
    meta_description: Optional[str] = None
    meta_robots: Optional[str] = None
    canonical: Optional[str] = None
    html_lang: Optional[str] = None
    hreflangs: Dict[str, str] = field(default_factory=dict)
    og_url: Optional[str] = None
    ids: Counter = field(default_factory=Counter)
    h1_count: int = 0
    local_refs: List[Tuple[str, str]] = field(default_factory=list)
    json_ld_blocks: List[str] = field(default_factory=list)
    raw_text: str = ""
    # Step 2: deep pair comparison fields
    prices: List[str] = field(default_factory=list)
    booking_links: List[str] = field(default_factory=list)
    json_ld_parsed: List[dict] = field(default_factory=list)
    gesy_numbers: List[str] = field(default_factory=list)


RE_PRICE = re.compile(r"€\s*\d+(?:[.,]\d+)?")
RE_GESY_LABEL = re.compile(r"\bA\d{4}\b")


class PageParser(HTMLParser):
    def __init__(self, page_path: Path):
        super().__init__(convert_charrefs=True)
        self.data = PageData(
            path=page_path,
            language="en",
            page_type=classify_page(page_path),
        )
        self._in_title = False
        self._current_title = []
        self._capture_json_ld = False
        self._current_json_ld = []
        self._text_chunks = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        attr_map = {k.lower(): (v or "") for k, v in attrs}
        if tag == "html":
            self.data.html_lang = attr_map.get("lang")
        if tag == "title":
            self.data.title_count += 1
            self._in_title = True
            self._current_title = []
        if tag == "meta" and attr_map.get("name", "").lower() == "description":
            self.data.meta_description = attr_map.get("content", "").strip()
        if tag == "meta" and attr_map.get("name", "").lower() == "robots":
            self.data.meta_robots = attr_map.get("content", "").strip()
        if tag == "meta" and attr_map.get("property", "").lower() == "og:url":
            self.data.og_url = attr_map.get("content", "").strip()
        if tag == "link":
            rel = attr_map.get("rel", "").lower()
            href = attr_map.get("href", "").strip()
            if rel == "canonical":
                self.data.canonical = href
            if rel == "alternate" and attr_map.get("hreflang"):
                self.data.hreflangs[attr_map["hreflang"]] = href
            if href:
                self.data.local_refs.append(("href", href))
        if tag == "a":
            href = attr_map.get("href", "").strip()
            if "booking" in href.lower():
                self.data.booking_links.append(href)
        if tag in ("script", "img", "source", "iframe"):
            src = attr_map.get("src", "").strip()
            if src:
                self.data.local_refs.append(("src", src))
        if tag == "img":
            srcset = attr_map.get("srcset", "").strip()
            if srcset:
                for item in srcset.split(","):
                    candidate = item.strip().split(" ")[0]
                    if candidate:
                        self.data.local_refs.append(("srcset", candidate))
        if tag == "script" and attr_map.get("type", "").lower() == "application/ld+json":
            self._capture_json_ld = True
            self._current_json_ld = []
        if tag == "h1":
            self.data.h1_count += 1
        element_id = attr_map.get("id")
        if element_id:
            self.data.ids[element_id] += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
            self.data.title = "".join(self._current_title).strip()
        if tag == "script" and self._capture_json_ld:
            self._capture_json_ld = False
            self.data.json_ld_blocks.append("".join(self._current_json_ld).strip())

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._current_title.append(data)
        if self._capture_json_ld:
            self._current_json_ld.append(data)
        text = data.strip()
        if text:
            self._text_chunks.append(text)

    def finalize(self) -> PageData:
        self.data.raw_text = "\n".join(self._text_chunks)
        # Extract prices from visible text
        self.data.prices = sorted(set(RE_PRICE.findall(self.data.raw_text)))
        # Extract GESY registration numbers (near GESY labels)
        self.data.gesy_numbers = sorted(set(RE_GESY_LABEL.findall(self.data.raw_text)))
        # Parse JSON-LD blocks
        for block in self.data.json_ld_blocks:
            try:
                self.data.json_ld_parsed.append(json.loads(block))
            except json.JSONDecodeError:
                pass
        return self.data


def parse_page(path: Path, pair_suffix: str) -> PageData:
    parser = PageParser(path)
    with open(path, "r", encoding="utf-8") as fh:
        parser.feed(fh.read())
    data = parser.finalize()
    data.language = infer_language(path, pair_suffix)
    return data


def add_finding(findings: List[dict], severity: str, kind: str, rule_id: str, path: Path, message: str, suggestion: str, pair_path: Optional[Path] = None) -> None:
    findings.append({
        "severity": severity,
        "type": kind,
        "rule_id": rule_id,
        "file": path.relative_to(ROOT).as_posix(),
        "paired_file": pair_path.relative_to(ROOT).as_posix() if pair_path else None,
        "message": message,
        "suggested_fix": suggestion,
    })


def check_page(data: PageData, config: dict, findings: List[dict]) -> None:
    expected_url = local_path_to_url(data.path, config["site_url"])
    pair_path = expected_pair(data.path, config["pair_suffix"])
    pair_exists = bool(pair_path and pair_path.exists())

    if data.title_count != 1 or not data.title:
        add_finding(findings, "medium", "structure", "title-single", data.path, f"Expected exactly one non-empty <title>; found {data.title_count}.", "Keep one <title> per page and ensure it is non-empty.")

    if not data.meta_description:
        add_finding(findings, "medium", "seo", "meta-description-required", data.path, "Missing meta description.", "Add a unique meta description for the page.")
    else:
        desc_len = len(data.meta_description)
        if desc_len < config["meta_description"]["min_length"] or desc_len > config["meta_description"]["max_length"]:
            add_finding(findings, "low", "seo", "meta-description-length", data.path, f"Meta description length is {desc_len}; expected {config['meta_description']['min_length']}-{config['meta_description']['max_length']}.", "Trim or expand the description into the target range.")

    if data.canonical != expected_url:
        add_finding(findings, "high", "seo", "canonical-self", data.path, f"Canonical is '{data.canonical}' but expected '{expected_url}'.", "Set canonical to the page's own public URL.")

    if data.og_url and data.og_url != expected_url:
        add_finding(findings, "medium", "seo", "og-url-match", data.path, f"og:url is '{data.og_url}' but expected '{expected_url}'.", "Keep og:url aligned with the public page URL.")

    expected_lang = data.language
    actual_lang = (data.html_lang or "").split("-", 1)[0]
    if actual_lang != expected_lang:
        add_finding(findings, "high", "structure", "html-lang", data.path, f"html lang is '{data.html_lang}' but expected language '{expected_lang}'.", "Set the <html lang> attribute to match the page language.")

    if data.h1_count != 1:
        add_finding(findings, "medium", "structure", "h1-single", data.path, f"Expected exactly one <h1>; found {data.h1_count}.", "Keep one primary <h1> per page.")

    if pair_exists:
        for lang in config["required_hreflangs_for_paired_pages"]:
            if lang not in data.hreflangs:
                add_finding(findings, "high", "seo", "hreflang-required", data.path, f"Missing hreflang '{lang}' on paired page.", "Add the required hreflang link set for paired pages.", pair_path=pair_path)
        if data.language == "en":
            expected_targets = {
                "en": expected_url,
                "el": local_path_to_url(pair_path, config["site_url"]),
                "x-default": expected_url,
            }
        else:
            expected_targets = {
                "en": local_path_to_url(pair_path, config["site_url"]),
                "el": expected_url,
                "x-default": local_path_to_url(pair_path, config["site_url"]),
            }
        for lang, expected_target in expected_targets.items():
            actual_target = normalize_url(data.hreflangs.get(lang, ""))
            if actual_target and actual_target != expected_target:
                add_finding(findings, "high", "seo", "hreflang-target", data.path, f"hreflang '{lang}' points to '{actual_target}' but expected '{expected_target}'.", "Fix hreflang targets to the correct language URLs.", pair_path=pair_path)

    for block_index, block in enumerate(data.json_ld_blocks, start=1):
        try:
            json.loads(block)
        except json.JSONDecodeError as exc:
            add_finding(findings, "high", "schema", "jsonld-parse", data.path, f"JSON-LD block {block_index} is invalid JSON: {exc.msg}.", "Fix the JSON-LD syntax so it parses cleanly.")

    for ref_type, ref in data.local_refs:
        local_target = resolve_local_reference(data.path, ref)
        if local_target and not local_target.exists():
            add_finding(findings, "high", "linking", "local-ref-exists", data.path, f"{ref_type} reference '{ref}' does not resolve to a file in the repo.", "Fix the path or restore the missing target.")

    duplicate_ids = [element_id for element_id, count in data.ids.items() if count > 1]
    for element_id in sorted(duplicate_ids):
        add_finding(findings, "medium", "structure", "duplicate-id", data.path, f"Duplicate id '{element_id}' appears {data.ids[element_id]} times.", "Make DOM ids unique within the page.")


def _extract_schema_field(schema: dict, field: str):
    """Extract a field from a JSON-LD object, handling @graph wrappers."""
    if "@graph" in schema:
        for item in schema["@graph"]:
            val = item.get(field)
            if val is not None:
                return val
    return schema.get(field)


def _collect_schema_dates(schema: dict) -> List[str]:
    """Recursively collect all date values from JSON-LD."""
    dates = []
    if isinstance(schema, dict):
        for key, val in schema.items():
            if key in ("datePublished", "dateModified", "dateCreated", "startDate", "endDate"):
                if isinstance(val, str):
                    dates.append(f"{key}={val}")
            else:
                dates.extend(_collect_schema_dates(val))
    elif isinstance(schema, list):
        for item in schema:
            dates.extend(_collect_schema_dates(item))
    return dates


def _collect_schema_prices(schema: dict) -> List[str]:
    """Recursively collect price/priceCurrency pairs from JSON-LD."""
    prices = []
    if isinstance(schema, dict):
        if "price" in schema:
            price = str(schema["price"])
            currency = schema.get("priceCurrency", "")
            prices.append(f"{currency}{price}")
        for val in schema.values():
            prices.extend(_collect_schema_prices(val))
    elif isinstance(schema, list):
        for item in schema:
            prices.extend(_collect_schema_prices(item))
    return prices


def _collect_schema_ratings(schema: dict) -> List[str]:
    """Recursively collect aggregateRating values from JSON-LD."""
    ratings = []
    if isinstance(schema, dict):
        if schema.get("@type") == "AggregateRating":
            rv = schema.get("ratingValue", "")
            rc = schema.get("reviewCount", schema.get("ratingCount", ""))
            ratings.append(f"{rv}/{rc}")
        for val in schema.values():
            ratings.extend(_collect_schema_ratings(val))
    elif isinstance(schema, list):
        for item in schema:
            ratings.extend(_collect_schema_ratings(item))
    return ratings


def _normalize_booking_params(links: List[str]) -> set:
    """Extract query parameter sets from booking links, stripping lang= param."""
    params = set()
    for link in links:
        qs = link.split("?", 1)[1] if "?" in link else ""
        if qs:
            # Remove lang= parameter (expected to differ between EN/EL)
            parts = [p for p in qs.split("&") if not p.startswith("lang=")]
            normalized = "&".join(sorted(parts))
            if normalized:
                params.add(normalized)
    return params


def check_pairs(page_map: Dict[Path, PageData], config: dict, findings: List[dict]) -> None:
    processed = set()
    for path, data in page_map.items():
        pair_path = expected_pair(path, config["pair_suffix"])
        if not pair_path or pair_path in processed or path in processed:
            continue
        if pair_path.exists():
            other = page_map.get(pair_path)
            if not other:
                continue
            processed.add(path)
            processed.add(pair_path)
            if data.page_type != other.page_type:
                add_finding(findings, "high", "translation-parity", "pair-page-type", path, f"Paired page types differ: '{data.page_type}' vs '{other.page_type}'.", "Keep paired pages in the same page family.", pair_path=pair_path)

            for label, variants in (
                ("phone", config["shared_business_data"]["phone_variants"]),
                ("email", config["shared_business_data"]["email_variants"]),
            ):
                present_a = [v for v in variants if v in data.raw_text]
                present_b = [v for v in variants if v in other.raw_text]
                if bool(present_a) != bool(present_b):
                    add_finding(findings, "high", "business-data", f"pair-{label}-presence", path, f"{label} appears in one language version but not the other.", "Align the shared business contact data across the paired pages.", pair_path=pair_path)

            # --- Step 2: Deep pair checks ---

            # 1. Price parity (visible text)
            if sorted(data.prices) != sorted(other.prices):
                add_finding(findings, "high", "translation-parity", "pair-prices", path,
                    f"Prices differ between language versions: {data.prices} vs {other.prices}.",
                    "Ensure all € amounts match across both language versions.",
                    pair_path=pair_path)

            # 2. GESY registration numbers
            if sorted(data.gesy_numbers) != sorted(other.gesy_numbers):
                add_finding(findings, "high", "business-data", "pair-gesy-numbers", path,
                    f"GESY numbers differ: {data.gesy_numbers} vs {other.gesy_numbers}.",
                    "Ensure GESY registration numbers match across both language versions.",
                    pair_path=pair_path)

            # 3. Booking link query parameters (service=, therapist= should match)
            params_a = _normalize_booking_params(data.booking_links)
            params_b = _normalize_booking_params(other.booking_links)
            if params_a != params_b:
                add_finding(findings, "high", "translation-parity", "pair-booking-params", path,
                    f"Booking link parameters differ: {sorted(params_a)} vs {sorted(params_b)}.",
                    "Ensure booking links pass the same service/therapist parameters in both versions.",
                    pair_path=pair_path)

            # 4. Schema dates parity
            all_dates_a = sorted(set(d for s in data.json_ld_parsed for d in _collect_schema_dates(s)))
            all_dates_b = sorted(set(d for s in other.json_ld_parsed for d in _collect_schema_dates(s)))
            if all_dates_a != all_dates_b:
                diff_a = set(all_dates_a) - set(all_dates_b)
                diff_b = set(all_dates_b) - set(all_dates_a)
                diff_parts = []
                if diff_a:
                    diff_parts.append(f"only in EN: {sorted(diff_a)}")
                if diff_b:
                    diff_parts.append(f"only in EL: {sorted(diff_b)}")
                add_finding(findings, "high", "schema", "pair-schema-dates", path,
                    f"Schema dates differ between language versions: {'; '.join(diff_parts)}.",
                    "Keep datePublished, dateModified, dateCreated identical in both language versions.",
                    pair_path=pair_path)

            # 5. Schema prices parity
            schema_prices_a = sorted(set(p for s in data.json_ld_parsed for p in _collect_schema_prices(s)))
            schema_prices_b = sorted(set(p for s in other.json_ld_parsed for p in _collect_schema_prices(s)))
            if schema_prices_a != schema_prices_b:
                add_finding(findings, "high", "schema", "pair-schema-prices", path,
                    f"Schema prices differ: {schema_prices_a} vs {schema_prices_b}.",
                    "Keep prices in JSON-LD identical across both language versions.",
                    pair_path=pair_path)

            # 6. Schema ratings parity
            ratings_a = sorted(set(r for s in data.json_ld_parsed for r in _collect_schema_ratings(s)))
            ratings_b = sorted(set(r for s in other.json_ld_parsed for r in _collect_schema_ratings(s)))
            if ratings_a != ratings_b:
                add_finding(findings, "high", "schema", "pair-schema-ratings", path,
                    f"Schema ratings differ: {ratings_a} vs {ratings_b}.",
                    "Keep aggregateRating values identical across both language versions.",
                    pair_path=pair_path)


def parse_sitemap_urls(site_url: str) -> List[str]:
    sitemap_path = ROOT / "sitemap.xml"
    if not sitemap_path.exists():
        return []
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for loc in root.findall(".//sm:loc", ns):
        if loc.text:
            urls.append(loc.text.strip())
    return urls


def check_site(page_map: Dict[Path, PageData], config: dict, findings: List[dict]) -> None:
    sitemap_urls = parse_sitemap_urls(config["site_url"])
    known_urls = {local_path_to_url(path, config["site_url"]) for path in page_map}
    sitemap_set = set(sitemap_urls)
    skip_page_types = set(config.get("sitemap", {}).get("skip_page_types", []))
    skip_robots_tokens = {
        token.lower() for token in config.get("sitemap", {}).get("skip_when_meta_robots_contains", [])
    }

    for url in sitemap_urls:
        target = url_to_local_path(url, config["site_url"])
        if target and not target.exists():
            rel = target.relative_to(ROOT).as_posix() if target.is_relative_to(ROOT) else str(target)
            findings.append({
                "severity": "high",
                "type": "linking",
                "rule_id": "sitemap-target-exists",
                "file": rel,
                "paired_file": None,
                "message": f"Sitemap URL '{url}' does not map to an existing file.",
                "suggested_fix": "Remove the URL from sitemap.xml or restore the file.",
            })

    for path, data in page_map.items():
        url = local_path_to_url(path, config["site_url"])
        robots_tokens = {
            token.strip().lower()
            for token in (data.meta_robots or "").split(",")
            if token.strip()
        }
        skip_for_sitemap = (
            path.name == "404.html"
            or data.page_type in skip_page_types
            or bool(robots_tokens & skip_robots_tokens)
        )
        if url not in sitemap_set and not skip_for_sitemap:
            add_finding(findings, "medium", "seo", "sitemap-missing", path, "Page is not present in sitemap.xml.", "Add the page to sitemap.xml if it should be indexed.")

    for path, data in page_map.items():
        if data.canonical and data.canonical not in known_urls:
            local_target = url_to_local_path(data.canonical, config["site_url"])
            if local_target is not None and not local_target.exists():
                add_finding(findings, "high", "seo", "canonical-target-exists", path, f"Canonical target '{data.canonical}' does not exist in the repo.", "Fix the canonical target.")
        for lang, href in data.hreflangs.items():
            local_target = url_to_local_path(href, config["site_url"])
            if local_target is not None and not local_target.exists():
                add_finding(findings, "high", "seo", "hreflang-target-exists", path, f"hreflang '{lang}' points to missing file '{href}'.", "Fix the hreflang target URL.")


def write_reports(findings: List[dict]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = OUTPUT_DIR / "qa-report.json"
    md_path = OUTPUT_DIR / "qa-report.md"

    with open(json_path, "w", encoding="utf-8") as fh:
        json.dump(findings, fh, indent=2, ensure_ascii=False)

    counts = Counter(item["severity"] for item in findings)
    ordered = ["critical", "high", "medium", "low"]
    lines = [
        "# Site QA Report",
        "",
        f"Total findings: {len(findings)}",
        "",
        "## Severity Summary",
        "",
    ]
    for severity in ordered:
        lines.append(f"- {severity}: {counts.get(severity, 0)}")
    lines.extend(["", "## Findings", ""])

    severity_rank = {name: idx for idx, name in enumerate(ordered)}
    findings_sorted = sorted(findings, key=lambda item: (severity_rank.get(item["severity"], 99), item["file"], item["rule_id"]))
    if not findings_sorted:
        lines.append("No findings.")
    else:
        for item in findings_sorted:
            pair_text = f" | pair: {item['paired_file']}" if item.get("paired_file") else ""
            lines.append(f"- [{item['severity']}] `{item['rule_id']}` `{item['file']}`{pair_text}: {item['message']} Fix: {item['suggested_fix']}")

    with open(md_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


def collect_pages(config: dict, requested_paths: Optional[List[str]]) -> Dict[Path, PageData]:
    ignore_names = set(config.get("ignore_files", []))
    html_paths: List[Path] = []
    if requested_paths:
        for item in requested_paths:
            path = (ROOT / item).resolve() if not item.startswith("/") else Path(item).resolve()
            if path.is_file() and path.suffix == ".html":
                html_paths.append(path)
    else:
        html_paths.extend(sorted(ROOT.glob("*.html")))
        html_paths.extend(sorted((ROOT / "pages").rglob("*.html")))
    page_map = {}
    for path in html_paths:
        if path.name in ignore_names:
            continue
        page_map[path] = parse_page(path, config["pair_suffix"])
    return page_map


def main() -> int:
    parser = argparse.ArgumentParser(description="Static site QA for Right Track.")
    parser.add_argument("paths", nargs="*", help="Optional HTML files to check, relative to repo root.")
    args = parser.parse_args()

    config = load_config()
    page_map = collect_pages(config, args.paths if args.paths else None)
    findings: List[dict] = []

    for data in page_map.values():
        check_page(data, config, findings)
    check_pairs(page_map, config, findings)
    check_site(page_map, config, findings)
    write_reports(findings)

    critical_or_high = sum(1 for item in findings if item["severity"] in {"critical", "high"})
    print(f"Scanned {len(page_map)} HTML files")
    print(f"Findings: total={len(findings)}, high_or_critical={critical_or_high}")
    print(f"Reports: {OUTPUT_DIR / 'qa-report.json'}")
    print(f"Reports: {OUTPUT_DIR / 'qa-report.md'}")
    return 1 if critical_or_high else 0


if __name__ == "__main__":
    sys.exit(main())
