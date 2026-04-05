# SEO Sprint Orchestration

## Purpose
This file defines which tasks can run in parallel and which tasks should wait for upstream decisions.

## Wave 0: Immediate, Independent

### Agent 5
Brief:
- `docs/agent-briefs/agent-5-event-schema-rich-results-cleanup.md`

Why first:
- independent from content rewrites
- directly addresses current Google Search Console `Events` enhancement warnings
- low conflict with other work

## Wave 1: Main Parallel Work

### Agent 6
Brief:
- `docs/agent-briefs/agent-6-homepage-focus-and-priority-order.md`

### Agent 7
Brief:
- `docs/agent-briefs/agent-7-priority-blog-rewrites-en.md`

These can run in parallel because:
- homepage scope is isolated
- English blog scope is isolated

## Wave 2: Dependent Follow-Through

### Agent 8
Brief:
- `docs/agent-briefs/agent-8-priority-blog-rewrites-el.md`

Start only after:
- Agent 7 completes

Reason:
- Greek pages should mirror the final English intent decisions, not stale versions

### Agent 10
Brief:
- `docs/agent-briefs/agent-10-gesy-landing-page-and-intent-separation.md`

Start after:
- Agent 6 completes
- Agent 8 completes

Reason:
- the landing page task overlaps with GESY cluster work
- it should build on the final homepage hierarchy and EN/EL article roles
- it replaces the narrower GESY-cluster-only task

## Recommended Execution Order

1. Run Agent 5
2. Run Agent 6 and Agent 7 in parallel
3. When Agent 7 finishes, run Agent 8
4. Then run Agent 10

## If You Want Maximum Concurrency

Safe parallel set:
- Agent 5
- Agent 6
- Agent 7

Do not start in parallel:
- Agent 8 before Agent 7
- Agent 10 before homepage and EN/EL GESY article roles are settled

## Notes
- `seminar-muay-thai` is not part of the current GSC event warning cleanup path
- Event warnings are enhancement-level issues, not indexing failures
- English-first for blog intent is the correct dependency model
