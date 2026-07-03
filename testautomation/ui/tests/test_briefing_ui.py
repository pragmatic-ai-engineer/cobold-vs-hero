from __future__ import annotations

import os

import pytest

from playwright.sync_api import Error as PlaywrightError, sync_playwright  # noqa: E402

from page_objects import CoboldBriefingPOM  # noqa: E402
from steps import (  # noqa: E402
    navigate_to_cobold_briefing,
    normal_release_matrix_rows_are_covered,
    production_rollback_stop_condition_is_visible,
    request_production_release_readiness_without_rollback,
    rollback_missing_evidence_is_visible,
    runtime_status_is_visible,
    shield_wall_signal_is_visible,
)


def test_production_without_rollback_is_visible_in_browser() -> None:
    ui_base_url = os.getenv("COBOLD_UI_BASE_URL", "http://localhost:4200")
    bff_base_url = os.getenv("COBOLD_API_BASE_URL")
    headless = os.getenv("COBOLD_UI_HEADLESS", "true").lower() != "false"

    with sync_playwright() as playwright:
        try:
            browser = playwright.chromium.launch(headless=headless)
        except PlaywrightError as error:
            pytest.fail(f"Chromium failed to launch for Playwright. Run: mise run ui:install-browsers. {error}")

        try:
            page = browser.new_page()
            pom = CoboldBriefingPOM(page, ui_base_url=ui_base_url, bff_base_url=bff_base_url)

            navigate_to_cobold_briefing(pom)
            runtime_status_is_visible(pom)
            request_production_release_readiness_without_rollback(pom)
            shield_wall_signal_is_visible(pom)
            rollback_missing_evidence_is_visible(pom)
            production_rollback_stop_condition_is_visible(pom)
            normal_release_matrix_rows_are_covered(pom)
        finally:
            browser.close()
