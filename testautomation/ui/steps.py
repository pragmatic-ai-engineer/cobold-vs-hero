from page_objects import BriefingFormData, CoboldBriefingPOM

RELEASE_SURFACES = ("backend", "bff", "frontend", "contract", "testing")
NORMAL_RELEASE_EVIDENCE = ("backend-test", "bruno-smoke", "dps-testautomation", "browser-screenshot", "hld", "lld")


def navigate_to_cobold_briefing(pom: CoboldBriefingPOM) -> None:
    pom.open()


def runtime_status_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_runtime_status_up()


def request_production_release_readiness_without_rollback(pom: CoboldBriefingPOM) -> None:
    pom.fill_briefing_form(
        BriefingFormData(
            change_title="Production release without rollback",
            change_description="Deploy a production payment retry fix with test and browser evidence but no rollback path.",
            affected_surfaces=RELEASE_SURFACES,
            provided_evidence=NORMAL_RELEASE_EVIDENCE,
            risk_flags=("production",),
        )
    )
    pom.request_briefing()


def shield_wall_signal_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_visible_signal("shield-wall")


def rollback_missing_evidence_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_missing_evidence_mentions("rollback")


def production_rollback_stop_condition_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_stop_condition_mentions("production")
    pom.assert_stop_condition_mentions("rollback")


def normal_release_matrix_rows_are_covered(pom: CoboldBriefingPOM) -> None:
    pom.assert_matrix_rows_covered(RELEASE_SURFACES)
