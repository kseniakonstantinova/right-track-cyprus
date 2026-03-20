# GitHub PR Workflow For Multi-Agent Changes

## What exists already

This repo now has an automated deterministic QA check:

- workflow: `.github/workflows/site-qa.yml`
- local command: `python3 tools/site-qa/run.py`

This is not a unit-test suite or browser end-to-end test suite.
It is a site QA gate for static HTML integrity and SEO structure.

It currently checks:

- title and meta description presence/range
- canonical correctness
- `hreflang` correctness
- `html lang`
- `h1` structure
- JSON-LD parse validity
- broken local links and asset paths
- sitemap policy with `noindex` awareness

## Recommended workflow

If you work with multiple agents, do not let everyone commit directly into `main`.

Use this model:

1. each agent works in its own branch
2. each branch opens a Pull Request
3. GitHub Actions runs `Site QA` automatically on the PR
4. merge to `main` only when the check is green

Recommended branch naming:

- `agent/seo-fixes`
- `agent/blog-update`
- `agent/service-copy`
- `agent/legal-cleanup`
- `agent/qa-tooling`

## Why this matters

Without PR checks:

- one agent can silently break metadata or links
- another agent can merge conflicting content structure
- regressions go directly into `main`

With PR checks:

- each change is isolated
- QA runs before merge
- broken pages are caught before they land
- `main` stays deployable

## What to enable in GitHub

Open:

- repository `Settings`
- `Branches`
- `Branch protection rules`

Create or edit a rule for:

- branch name pattern: `main`

Enable these options:

### 1. Require a pull request before merging

Turn on:

- `Require a pull request before merging`

Recommended:

- require at least `1` approval if other people review
- if you work mostly solo with agents, approval is optional

### 2. Require status checks to pass before merging

Turn on:

- `Require status checks to pass before merging`

Then select the check from the workflow:

- `qa`

Depending on GitHub UI, the displayed name may appear as:

- `Site QA / qa`

This is the important gate.

### 3. Block direct pushes to main

Recommended:

- do not allow direct pushes to `main`

This forces all meaningful changes through PRs.

### 4. Require branches to be up to date before merging

Recommended:

- enable `Require branches to be up to date before merging`

This reduces stale merges when several agents work in parallel.

## Practical daily process

### Local

Before pushing:

```bash
python3 tools/site-qa/run.py
```

If it passes, push the branch.

### GitHub

After opening the PR:

- wait for `Site QA / qa`
- if red, fix the branch
- merge only when green

## Recommended policy for multi-agent work

Good:

- one agent = one branch = one focused PR
- merge small PRs
- keep PRs scoped to one task family

Bad:

- several agents writing to `main`
- one PR containing unrelated changes
- merging with red checks

## Suggested minimum policy

For this repository, the minimum safe setup is:

- `main` protected
- PR required
- `Site QA / qa` required before merge

That alone will already reduce most accidental regressions.

## Later improvements

If the site grows, you can add more required checks later:

- HTML linting
- Lighthouse / performance checks
- link crawler
- visual regression checks
- deploy preview checks

For now, `Site QA` is the correct first gate.
