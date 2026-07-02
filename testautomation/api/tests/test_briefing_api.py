from client import BriefingRequest, CoboldBriefingClient


def test_status_reports_bff_and_backend_up() -> None:
    response = CoboldBriefingClient().get_status()

    assert response["status"] == "UP"
    assert [service["service"] for service in response["services"]] == ["bff-nestjs", "be-java"]
    assert all(service["status"] == "UP" for service in response["services"])


def test_truce_readiness_has_no_missing_evidence() -> None:
    response = CoboldBriefingClient().create_briefing(
        BriefingRequest(
            change_title="Backend label endpoint",
            change_description="Add one small backend endpoint and attach the backend unit test.",
            affected_surfaces=["backend"],
            provided_evidence=["backend-test"],
            risk_flags=[],
        )
    )

    assert response["signal"] == "truce"
    assert response["requiredEvidence"] == ["backend-test"]
    assert response["missingEvidence"] == []
    assert response["reviewMatrix"][0]["surface"] == "backend"
    assert response["reviewMatrix"][0]["gap"] == "covered"


def test_sparring_readiness_reports_missing_ui_and_bff_evidence() -> None:
    response = CoboldBriefingClient().create_briefing(
        BriefingRequest(
            change_title="Status panel mapping",
            change_description="Add one backend field, one BFF mapper, and one Angular status panel.",
            affected_surfaces=["backend", "bff", "frontend"],
            provided_evidence=["backend-test", "hld", "lld"],
            risk_flags=[],
        )
    )

    assert response["signal"] == "sparring"
    assert response["requiredEvidence"] == ["backend-test", "bruno-smoke", "browser-screenshot", "hld", "lld"]
    assert response["missingEvidence"] == ["bruno-smoke", "browser-screenshot"]
    assert "browser evidence" in response["nextAction"].lower()


def test_shield_wall_readiness_requires_split_for_high_risk_missing_proof() -> None:
    response = CoboldBriefingClient().create_briefing(
        BriefingRequest(
            change_title="Payment retry refactor",
            change_description="Refactor production payment retry flow and auth callback in one release.",
            affected_surfaces=["backend", "bff", "frontend", "contract", "testing"],
            provided_evidence=["hld"],
            risk_flags=["production", "payment", "auth", "unclear-scope"],
        )
    )

    assert response["signal"] == "shield-wall"
    assert response["missingEvidence"] == [
        "backend-test",
        "bruno-smoke",
        "browser-screenshot",
        "dps-testautomation",
        "lld",
    ]
    assert "Split the work" in response["stopCondition"]
    assert len(response["reviewMatrix"]) == 5
