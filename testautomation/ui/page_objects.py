from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urlencode, urlsplit, urlunsplit

from playwright.sync_api import Locator, Page, expect


@dataclass(frozen=True)
class BriefingFormData:
    cobold_concern: str
    hero_move: str
    system_mood: str
    target_environment: str = "dev"
    implementation_complexity: str = "low"
    team_experience: str = "senior"


class CoboldBriefingPOM:
    def __init__(self, page: Page, ui_base_url: str, bff_base_url: str | None = None) -> None:
        self.page = page
        self.ui_base_url = ui_base_url.rstrip("/")
        self.bff_base_url = bff_base_url.rstrip("/") if bff_base_url else None

    def open(self) -> None:
        self.page.goto(self._app_url(), wait_until="networkidle")
        expect(self.by_data_test("briefing-form")).to_be_visible()

    def assert_runtime_status_up(self) -> None:
        expect(self.by_data_test("status-page")).to_be_visible()
        expect(self.by_data_test("system-status")).to_have_text("UP")
        expect(self.by_data_test("service-status-bff-nestjs")).to_contain_text("UP")
        expect(self.by_data_test("service-status-be-java")).to_contain_text("UP")

    def fill_briefing_form(self, data: BriefingFormData) -> None:
        self.by_data_test("cobold-concern-input").fill(data.cobold_concern)
        self.by_data_test("hero-move-input").fill(data.hero_move)
        self.by_data_test("system-mood-input").fill(data.system_mood)
        self.by_data_test("target-environment-select").select_option(data.target_environment)
        self.by_data_test("implementation-complexity-select").select_option(data.implementation_complexity)
        self.by_data_test("team-experience-select").select_option(data.team_experience)

    def request_briefing(self) -> None:
        self.by_data_test("request-briefing-button").click()
        expect(self.by_data_test("briefing-signal")).to_be_visible()

    def assert_visible_signal(self, signal: str) -> None:
        expect(self.by_data_test("briefing-signal")).to_have_text(signal)

    def assert_evidence_prompt_mentions(self, expected_text: str) -> None:
        expect(self.by_data_test("evidence-prompts")).to_contain_text(expected_text)

    def assert_review_note_mentions(self, expected_text: str) -> None:
        expect(self.by_data_test("briefing-reviewer-note")).to_contain_text(expected_text)

    def by_data_test(self, value: str) -> Locator:
        return self.page.locator(f'[data-test="{value}"]')

    def _app_url(self) -> str:
        if not self.bff_base_url:
            return self.ui_base_url

        split_url = urlsplit(self.ui_base_url)
        query = urlencode({"bffBaseUrl": self.bff_base_url})
        return urlunsplit((split_url.scheme, split_url.netloc, split_url.path, query, split_url.fragment))
