package dev.workshop.demo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CoboldVsHeroControllerTests {

	private final CoboldVsHeroController controller = new CoboldVsHeroController(8080);

	@Test
	void returnsBackendStatus() {
		CoboldVsHeroController.StatusResponse response = controller.status();

		assertThat(response.service()).isEqualTo("be-java");
		assertThat(response.runtime()).isEqualTo("spring-boot");
		assertThat(response.status()).isEqualTo("UP");
		assertThat(response.port()).isEqualTo(8080);
		assertThat(response.checkedAt()).isNotBlank();
	}

	@Test
	void returnsTruceForSmallReviewedMove() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"one label is confusing in a support screen",
						"make a small text change and verify with a focused test",
						"calm and curious"));

		assertThat(response.signal()).isEqualTo("truce");
		assertThat(response.headline()).contains("review-ready starter slice");
		assertThat(response.reason()).contains("clear verification path");
		assertThat(response.evidencePrompts()).isNotEmpty();
	}

	@Test
	void returnsShieldWallForRiskyProductionPaymentRelease() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"production payment integration refactor goes to release",
						"rewrite the flow quickly",
						"panic"));

		assertThat(response.signal()).isEqualTo("shield-wall");
		assertThat(response.checklist()).first().isEqualTo("split the task");
		assertThat(response.reason()).contains("smaller slice");
	}
}
