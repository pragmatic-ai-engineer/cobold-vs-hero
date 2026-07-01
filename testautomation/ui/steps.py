from page_objects import BriefingFormData, CoboldBriefingPOM


def navigate_to_cobold_briefing(pom: CoboldBriefingPOM) -> None:
    pom.open()


def runtime_status_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_runtime_status_up()


def request_sparring_readiness_matrix(pom: CoboldBriefingPOM) -> None:
    pom.fill_briefing_form(
        BriefingFormData(
            change_title="Status panel mapping",
            change_description="Add one backend field, one BFF mapper, and one Angular status panel.",
        )
    )
    pom.request_briefing()


def sparring_signal_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_visible_signal("sparring")


def missing_evidence_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_missing_evidence_mentions("bruno-smoke")
    pom.assert_missing_evidence_mentions("browser-screenshot")
    pom.assert_matrix_mentions("frontend")
