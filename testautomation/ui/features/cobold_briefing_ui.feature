# language: en

@toy-onecare @ui @briefing
Feature: Cobold review readiness UI evidence
  The workshop app should expose the same review readiness matrix through the browser
  that the API automation already verifies at the BFF boundary.

  Scenario: Reviewer sees a production rollback shield-wall
    Given the Cobold briefing page is open
    And the runtime status shows the BFF and backend are up
    When I request production release readiness without rollback evidence
    Then the UI shows the shield-wall signal
    And rollback is visible as missing evidence
    And the production rollback stop condition is visible
    And the normal release matrix rows remain covered
