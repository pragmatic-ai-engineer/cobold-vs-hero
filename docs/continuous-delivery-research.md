# Continuous Delivery Research Note

Hungarian version: [continuous-delivery-research.hu.md](continuous-delivery-research.hu.md)

This workshop models the full enterprise delivery lifecycle in miniature:
solution design, executable contracts, Java backend, NestJS BFF, Angular
frontend, manual-tester smoke checks, heavier testautomation, infrastructure as
code, CI, and automated deployment.

The point is not that every enterprise system should look exactly like this
demo. The point is that a small repo can show the whole Continuous Delivery
system: every change should be small, understandable, testable, deployable, and
reviewable from idea to production.

## Core Thesis

Continuous Delivery is a socio-technical delivery system, not only a CI job or
a deploy button. The team designs the work so that `main` can stay close to a
releasable state, deployments become routine, and risk is reduced by shrinking
changes, automating feedback, and preserving human review.

For the workshop, the best short definition is:

```text
Idea -> solution -> contracts -> implementation -> verification -> package -> deploy -> evidence -> learning
```

## Lifecycle Map

| Lifecycle step | Workshop artifact | Best-practice signal |
| --- | --- | --- |
| Product/task framing | `docs/demo-task.md` | Work starts as a thin, reviewable slice with explicit non-goals. |
| AI blueprint and team prompts | `ai-runbook/` | AI support is made explicit instead of hidden in ad hoc chat history. |
| High-level design | `solution/cobold-briefing/hld.md` | Architecture boundaries, participants, risks, and non-goals are visible before code. |
| Low-level design | `solution/cobold-briefing/lld.md` | Endpoint behavior, mapping, validation, and edge cases are concrete enough to implement. |
| Decisions | `solution/cobold-briefing/decisions.md` | Tradeoffs are recorded so reviewers can judge intent, not only syntax. |
| Acceptance and test plan | `solution/cobold-briefing/acceptance-and-test-plan.md` | Test evidence is designed before the implementation is called done. |
| API contract | `contracts/openapi/cobold-briefing-api.yaml` | Backend, BFF, UI, smoke tests, and automation share one executable agreement. |
| Flow/state diagrams | `contracts/plantuml/` | Complex behavior is visualized before it becomes scattered through code. |
| Backend implementation | `backend/` | Java service owns domain behavior and unit-level confidence. |
| BFF implementation | `bff/` | NestJS owns UI-facing mapping and isolates frontend shape from backend internals. |
| Frontend implementation | `frontend/` | Angular owns the user workflow and screen-shareable evidence. |
| Developer/manual tester smoke | `smoke/api`, `smoke/ui` | Fast checks prove the deployed shape without requiring the full automation stack. |
| Heavier automation | `testautomation/api`, `testautomation/ui` | Robust API and browser suites protect repeatable regression paths. |
| Local task runner | `mise.toml` | Tool versions and commands are shared by humans, agents, and CI. |
| CI | `.github/workflows/ci.yaml` | Pull requests and pushes run the same verification entrypoint. |
| Container packaging | `backend/Dockerfile`, `bff/Dockerfile`, `frontend/Dockerfile` | Services become immutable deployment artifacts. |
| Kubernetes deployment | `deploy/helm/cobold-vs-hero/` | Runtime configuration is versioned and reviewable. |
| Server bootstrap | `infra/ansible/` | Cluster and runner setup are reproducible instead of tribal knowledge. |
| Edge/DNS infrastructure | `infra/terraform/cloudflare/` | External routing is managed as reviewed infrastructure code. |
| Auto deploy | `.github/workflows/deploy.yaml` | The pipeline builds images, pushes them to GHCR, and deploys with Helm. |

## Practices This Demonstrates

1. **Thin vertical slices.** A useful change should pass through docs,
   contracts, backend, BFF, frontend, tests, and deployment without becoming a
   multi-week integration event.

2. **Everything important is versioned.** Solution intent, contracts, samples,
   smoke tests, automation, Helm, Ansible, Terraform, and workflows live beside
   code, so drift is reviewable.

3. **Contracts connect roles.** OpenAPI and samples are not documentation
   theater; they are the shared boundary between architects, backend developers,
   BFF developers, frontend developers, testers, and AI agents.

4. **Feedback is layered by cost.** Local builds and unit tests run first;
   Bruno and Playwright smoke checks prove the manual-tester path; pytest and
   Playwright automation give deeper regression confidence.

5. **Manual testing still has a designed role.** Manual testers should get
   quick smoke collections, browser-visible evidence, and clear acceptance
   prompts, not only vague "please test" requests.

6. **Automation supports, but does not replace, review.** CI should block
   obvious regressions. Humans still inspect scope, tradeoffs, release risk,
   data handling, UX, and whether the slice is actually worth shipping.

7. **Deployments use reviewed runtime definitions.** Helm, Ansible, Terraform,
   and GitHub Actions make the runtime path visible: build images, configure the
   cluster, route traffic, and deploy by commit SHA.

8. **The same commands serve humans and agents.** `mise run verify`,
   `mise run api:smoke`, `mise run ui:smoke`, and the testautomation commands
   give developers, testers, CI, and AI assistants one common operating surface.

9. **Measure speed and stability together.** DORA now frames delivery
   performance around five metrics: change lead time, deployment frequency,
   failed deployment recovery time, change fail rate, and deployment rework
   rate. The workshop can use these as the scorecard for delivery improvement.

10. **AI belongs inside the delivery loop.** AI is strongest when it prepares
    context, drafts options, checks drift, suggests tests, summarizes evidence,
    and reviews diffs against explicit acceptance criteria.

## AI Tooling Extension Points

Use AI where it strengthens the delivery system:

| Delivery moment | AI can help by | Guardrail |
| --- | --- | --- |
| Task shaping | Turning vague asks into scope, non-goals, risks, and questions. | Keep the human product owner responsible for value and priority. |
| HLD/LLD drafting | Producing first-pass design options and edge cases from the task. | Require source files, constraints, and explicit assumptions. |
| Contract work | Detecting OpenAPI/sample/implementation drift. | Treat the checked-in contract as the reviewable source, not chat text. |
| Implementation | Generating small diffs across Java, BFF, and Angular. | Ask for the smallest vertical slice and inspect every diff. |
| Test design | Proposing unit, smoke, API automation, and browser paths. | Avoid duplicate tests; push checks to the cheapest useful layer. |
| Verification | Running repo-owned commands and summarizing evidence. | Evidence must include commands, targets, and remaining gaps. |
| Review | Checking scope, risk, missing tests, and docs drift. | Review findings must cite files and lines, not vibes. |
| Release handoff | Drafting release notes, tester notes, and rollback notes. | Keep release authority with the human owner. |

## Workshop Storyline

1. Start with the Cobold vs Hero task and acceptance criteria.
2. Show how HLD, LLD, decisions, OpenAPI, diagrams, and samples make the work
   reviewable before implementation.
3. Implement or inspect one small vertical slice across backend, BFF, and UI.
4. Run fast local gates with `mise run verify`.
5. Run manual-tester smoke checks with Bruno and Playwright.
6. Run heavier API/UI automation for deeper confidence.
7. Show how CI repeats the same verification path.
8. Show how deploy builds images, pushes them to GHCR, and applies Helm to K3s.
9. Close the loop with evidence: what changed, what passed, what risk remains,
   and what should be improved next.

## Readiness Checklist

Use this as the high-signal Continuous Delivery checklist for any enterprise
slice:

- The task has scope, non-goals, risks, and acceptance criteria.
- HLD and LLD explain the intended behavior before code.
- API contracts and samples match implementation and tests.
- Local commands can verify the repo without hidden setup.
- Fast tests catch most mistakes before expensive UI automation runs.
- Manual testers have smoke paths that map to real acceptance criteria.
- CI runs the same commands developers and agents use locally.
- Deployment artifacts are immutable and tied to a commit SHA.
- Runtime configuration is versioned through Helm, Ansible, and Terraform.
- The deploy path includes rollout status and a known rollback story.
- Evidence is captured after verification, not reconstructed from memory.
- AI usage is explicit, reviewable, and bounded by checked-in context.

## Good Next Enhancements

This repo is already a strong Continuous Delivery teaching baseline. The next
high-value additions would be:

- Add post-deploy smoke checks to the deploy workflow.
- Add release notes and rollback notes generated from the merged diff.
- Add basic observability: health checks, structured logs, and one dashboard.
- Add dependency/security scanning and SBOM generation.
- Add preview environments for pull requests if the workshop needs review apps.
- Add feature-flag or branch-by-abstraction examples for risky changes.
- Add a small DORA/evidence dashboard that reads from GitHub Actions and deploy
  history.

## References

- [Continuous Delivery](https://continuousdelivery.com/) by Jez Humble and
  contributors: concise definition and principles.
- [Continuous Delivery: Reliable Software Releases through Build, Test, and
  Deployment Automation](https://martinfowler.com/books/continuousDelivery.html)
  by Jez Humble and David Farley: the foundational book.
- [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)
  by Martin Fowler: updated CI practice guide.
- [DORA software delivery performance metrics](https://dora.dev/guides/dora-metrics/):
  current delivery-performance scorecard.
- [Accelerate](https://itrevolution.com/product/accelerate/) by Nicole Forsgren,
  Jez Humble, and Gene Kim: research-backed software delivery performance.
- [The DevOps Handbook, Second Edition](https://itrevolution.com/product/the-devops-handbook-second-edition/)
  by Gene Kim, Jez Humble, Patrick Debois, John Willis, and Nicole Forsgren:
  enterprise transformation and the Three Ways.
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
  by Ham Vocke: practical test layering for delivery pipelines.
- [Trunk Based Development](https://trunkbaseddevelopment.com/) by Paul Hammant
  and contributors: branching model that supports CI/CD.
- [Google SRE: Release Engineering](https://sre.google/sre-book/release-engineering/):
  reproducible, automated release process guidance.
- [Team Topologies](https://teamtopologies.com/book) by Matthew Skelton and
  Manuel Pais: team design for fast flow.
- [Dave Farley: Continuous Delivery Explained in 15 Minutes](https://www.youtube.com/watch?v=tQMrrNo16jo):
  short video introduction.
- [Jez Humble: Continuous Delivery](https://www.youtube.com/watch?v=skLJuksCRTw):
  classic talk on the original practice.
