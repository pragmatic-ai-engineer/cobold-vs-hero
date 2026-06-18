# Decision Log

## D01 - Use `delivery-pack` For Shared Coordination

Status: Accepted

Use `delivery-pack/` instead of `.context/` to avoid confusion with agent
context. The folder is product/delivery coordination, not hidden agent memory.

## D02 - Keep HLD/LLD Out Of Scope

Status: Accepted

The workshop uses PRD, ADR, implementation plan, and loop contract. HLD/LLD are
real concepts in the participant environment but too heavy for this 3-hour
session.

## D03 - Include BFF And Testautomation As First-Class Surfaces

Status: Accepted

The sample repo should resemble the participant workflow: backend service,
NestJS BFF, Angular frontend, API contract, manual API smoke, and Python
testautomation.

## D04 - Keep The Domain Generic

Status: Accepted

Cobold is a risk-aware reviewer. Hero is a delivery proposer. The demo avoids
enterprise-specific and legacy-specific domain details.
