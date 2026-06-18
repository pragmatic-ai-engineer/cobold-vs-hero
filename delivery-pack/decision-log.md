# Decision Log

## D01 - Use `delivery-pack` For Shared Coordination

Status: Accepted

Use `delivery-pack/` instead of `.context/` to avoid confusion with agent
context. The folder is product/delivery coordination, not hidden agent memory.

## D02 - Include Lightweight HLD/LLD

Status: Accepted

The workshop includes lightweight HLD/LLD because they are real design
artifacts in the participant environment. They must stay compact:

- HLD captures system boundaries, flow, ownership, assumptions, and risks.
- LLD captures endpoint behavior, field mapping, validation, examples, and
  verification hooks.

The goal is not to produce enterprise-grade documentation. The goal is to make
the design artifacts part of the feedback loop before implementation starts.

## D03 - Include BFF And Testautomation As First-Class Surfaces

Status: Accepted

The sample repo should resemble the participant workflow: backend service,
NestJS BFF, Angular frontend, API contract, Bruno manual/API CLI smoke, and
Python testautomation.

## D04 - Keep The Domain Generic

Status: Accepted

Cobold is a risk-aware reviewer. Hero is a delivery proposer. The demo avoids
enterprise-specific and legacy-specific domain details.
