package dev.cpihero.demo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CoboldVsHeroControllerTests {

	private final CoboldVsHeroController controller = new CoboldVsHeroController();

	@Test
	void returnsTruceForSmallReviewedMove() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"one label is confusing in a support screen",
						"make a small text change and verify with a focused test",
						"calm and curious"));

		assertThat(response.signal()).isEqualTo("truce");
		assertThat(response.headline()).contains("safe starter slice");
	}

	@Test
	void returnsShieldWallForRiskyLegacyPaymentRelease() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"legacy mainframe payment batch refactor goes to prod",
						"rewrite the flow quickly",
						"panic"));

		assertThat(response.signal()).isEqualTo("shield-wall");
		assertThat(response.checklist()).first().isEqualTo("split the task");
	}
}
