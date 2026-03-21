# Branching Policy

## Goal

Keep `main` stable.

All meaningful work should happen in short-lived task branches and go into `main` through Pull Requests.

## Branch model

Use a very simple model:

- `main` = stable branch
- one task = one short-lived branch

Do not add extra long-lived branches like:

- `develop`
- `release/*`
- `staging/*`

This repository does not need heavy Git Flow.

## Who creates branches

Branches are usually created manually in git before work starts.

Recommended:

- the human decides the task
- the human or the agent creates the branch
- the agent works only inside that branch

Important:

- agents should not invent their own branch naming system on the fly
- use a small fixed naming convention

## Naming convention

Use one of these prefixes:

- `fix/`
- `content/`
- `chore/`

### Use `fix/` for

- broken links
- metadata issues
- layout bugs
- QA findings

Examples:

- `fix/hreflang-legal-pages`
- `fix/booking-heading`

### Use `content/` for

- blog text edits
- SEO copy edits
- service page wording
- legal copy edits

Examples:

- `content/blog-meta-cleanup`
- `content/service-copy-update`

### Use `chore/` for

- QA tooling
- CI/CD
- scripts
- repository maintenance

Examples:

- `chore/site-qa`
- `chore/github-branch-protection-docs`

## Rule for agents

Best practice:

- one agent = one branch = one focused task

Bad practice:

- multiple unrelated tasks in one branch
- multiple agents pushing unrelated work to `main`
- one giant branch for everything

## Recommended workflow

### 1. Start from main

```bash
git checkout main
git pull origin main
```

### 2. Create a task branch

```bash
git checkout -b chore/site-qa
```

Or:

```bash
git checkout -b content/blog-meta-cleanup
```

### 3. Do the work

Make only the changes related to that task.

### 4. Run QA before push

```bash
python3 tools/site-qa/run.py
```

### 5. Push branch

```bash
git push -u origin chore/site-qa
```

### 6. Open Pull Request

Open a PR from the task branch into `main`.

### 7. Merge only after checks pass

Merge only when:

- `Site QA / qa` is green
- the PR scope is clean

## Scope discipline

Each branch should ideally contain one kind of work only.

Good:

- one branch for QA tooling
- one branch for blog metadata cleanup
- one branch for legal page fixes

Bad:

- QA tooling + new article + footer redesign in one branch

## Summary

For this repository, the correct branch structure is:

- `main`
- short-lived task branches such as `fix/*`, `content/*`, `chore/*`

That is enough to support multi-agent work without unnecessary process overhead.
