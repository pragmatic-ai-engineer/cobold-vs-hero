# Implementation Plan

## Slice 1 - Contract And Backend Signal Details

- Add `reason` and `evidencePrompts` to the briefing response contract.
- Update backend response generation.
- Add focused backend tests for representative signals.

## Slice 2 - BFF Mapping

- Add a minimal NestJS BFF.
- Proxy the briefing request to the backend.
- Map backend fields to UI-facing names.
- Keep BFF logic thin and testable by API smoke.

## Slice 3 - Frontend Rendering

- Route the Angular app through the BFF.
- Render reason and evidence prompts.
- Keep the UI small and readable in a screen share.

## Slice 4 - Verification Harness

- Add contract samples and PlantUML flow/state notes.
- Add Bruno manual API smoke checks.
- Add DPS-lite Python API checks.
- Keep browser verification as a recipe or prepared replay for the workshop.

## Slice 5 - Workshop Loop

- Use the loop contract to run: plan, implement, verify, repair, review.
- Capture command results, API smoke evidence, browser evidence, and diff notes.
