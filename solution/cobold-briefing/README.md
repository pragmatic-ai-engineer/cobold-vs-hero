# Cobold Briefing Solution Package

This folder is the pre-implementation solution surface for the Cobold vs Hero
briefing slice.

It intentionally uses `solution`, not `design`, because frontend design can mean
Figma, visual direction, or UI layout. These files describe the technical
solution that should exist before implementation starts.

## Ownership Model

| Artifact | Primary owner | Purpose |
| --- | --- | --- |
| `hld.md` | Solution architect | End-to-end intent, boundaries, participants, major flow, risks, and non-goals. |
| `lld.md` | Implementation-team designer / senior developer | Endpoint details, mapping rules, status behavior, scoring details, validation, and implementation notes. |
| `decisions.md` | Team | Accepted technical decisions and consequences. |
| `acceptance-and-test-plan.md` | Team + tester | Acceptance criteria and evidence required before the slice is considered done. |

## Relationship To Contracts

`solution/` explains what the system should do and why.

`contracts/` is the swagger-style package that implementation and tests execute
against:

- OpenAPI request and response shape.
- PlantUML sequence and state diagrams.
- Request/response sample payloads.

When the solution changes, update the relevant contract artifacts before or
alongside implementation. When implementation changes behavior, review whether
the HLD, LLD, OpenAPI, PlantUML, samples, Bruno smoke checks, and automation
still describe the same thing.

## Workshop Loop

```text
draft HLD
-> refine LLD
-> update contracts
-> implement the smallest vertical slice
-> run code gates and smoke checks
-> capture evidence
-> review drift between solution, contracts, code, and tests
```

