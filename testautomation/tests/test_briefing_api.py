from cobold_qa.client import BriefingRequest, CoboldBriefingClient


def test_status_reports_bff_and_backend_up() -> None:
    response = CoboldBriefingClient().get_status()

    assert response["status"] == "UP"
    assert [service["service"] for service in response["services"]] == ["bff-nestjs", "be-java"]
    assert all(service["status"] == "UP" for service in response["services"])


def test_truce_briefing_contains_verification_reason() -> None:
    response = CoboldBriefingClient().create_briefing(
        BriefingRequest(
            cobold_concern="one label is confusing in a support screen",
            hero_move="make a small text change and verify with a focused test",
            system_mood="calm and curious",
        )
    )

    assert response["signal"] == "truce"
    assert "clear verification path" in response["reason"]
    assert response["evidencePrompts"]


def test_sparring_briefing_requires_sharper_acceptance_criteria() -> None:
    response = CoboldBriefingClient().create_briefing(
        BriefingRequest(
            cobold_concern="customer status mapping is inconsistent between API and UI",
            hero_move="add a mapper adapter and review targeted tests",
            system_mood="tired",
        )
    )

    assert response["signal"] == "sparring"
    assert "acceptance criteria" in response["reason"]
    assert "write acceptance criteria" in response["checklist"]


def test_shield_wall_briefing_requires_slice_split() -> None:
    response = CoboldBriefingClient().create_briefing(
        BriefingRequest(
            cobold_concern="production payment integration refactor goes to release",
            hero_move="rewrite the flow quickly",
            system_mood="panic",
        )
    )

    assert response["signal"] == "shield-wall"
    assert "smaller slice" in response["reason"]
    assert response["checklist"][0] == "split the task"
