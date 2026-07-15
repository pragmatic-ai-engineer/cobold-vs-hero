# Documentation

Hungarian version: [README.hu.md](README.hu.md).

This folder contains repo-level guidance. Component-specific details live next to
the component they describe.

## Start Here

- `../llms-full.txt` - single-file agent context pack for participants,
  facilitators, developers, testers, and reviewers.
- `onboarding/README.md` - full repo tour for a new contributor or workshop
  participant.
- `demo-task.md` - current workshop feature baseline and acceptance criteria.
- `observability-datadog.md` - Datadog setup and verification path.
- `continuous-delivery-research.md` - background research note for the delivery
  practices behind the repo.

## Related Entry Points

- `../README.md` - root overview, setup, run, deploy, and verification commands.
- `../solution/cobold-briefing/README.md` - solution package before
  implementation.
- `../contracts/README.md` - executable API and diagram contract.
- `../ai-runbook/README.md` - shared AI-assisted work instructions.
- `../smoke/api/README.md` and `../smoke/ui/README.md` - fast smoke checks.
- `../testautomation/README.md` - heavier tester-owned automation.

## Documentation Rule

Keep docs short, owned, and runnable. Prefer one strong entry point for a topic
over mirrored summaries in every folder.

After a documentation-only change, run `mise run contracts:check` to confirm
that the workshop's required documentation and contract artifacts are present.

Hungarian companions are reserved for the highest-signal participant docs:
orientation, onboarding, the workshop task, and key solution entry points.
