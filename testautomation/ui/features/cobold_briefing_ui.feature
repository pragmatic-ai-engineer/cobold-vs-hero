# language: en

@toy-onecare @ui @briefing
Feature: Cobold review readiness UI evidence
  The workshop app should expose the same review readiness matrix through the browser
  that the API automation already verifies at the BFF boundary.

  Scenario: Reviewer sees a sparring readiness matrix for a controllable slice
    Given the Cobold briefing page is open
    And the runtime status shows the BFF and backend are up
    When I request a readiness matrix for a status panel mapping change
    Then the UI shows the sparring signal
    And the matrix shows missing BFF and browser evidence
