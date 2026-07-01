from cobold_qa.ui.page_objects import BriefingFormData, CoboldBriefingPOM


def navigate_to_cobold_briefing(pom: CoboldBriefingPOM) -> None:
    pom.open()


def runtime_status_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_runtime_status_up()


def request_sparring_briefing(pom: CoboldBriefingPOM) -> None:
    pom.fill_briefing_form(
        BriefingFormData(
            cobold_concern="customer status mapping is inconsistent between API and UI",
            hero_move="add a mapper adapter and review targeted tests",
            system_mood="tired",
            target_environment="dev",
            implementation_complexity="low",
            team_experience="senior",
        )
    )
    pom.request_briefing()


def sparring_signal_is_visible(pom: CoboldBriefingPOM) -> None:
    pom.assert_visible_signal("sparring")
    pom.assert_evidence_prompt_mentions("acceptance criterion")
    pom.assert_review_note_mentions("customer status mapping")
