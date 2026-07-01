# language: en

@toy-onecare @ui @briefing
Feature: Cobold briefing UI evidence
  The workshop app should expose the same review signal through the browser
  that the API automation already verifies at the BFF boundary.

  Scenario: Reviewer sees a sparring signal for a risky but controllable slice
    Given the Cobold briefing page is open
    And the runtime status shows the BFF and backend are up
    When I request a briefing for a customer status mapping change
    Then the UI shows the sparring signal
    And the evidence prompts mention acceptance criteria
