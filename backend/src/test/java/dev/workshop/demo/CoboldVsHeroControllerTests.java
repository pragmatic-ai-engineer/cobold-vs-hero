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
						"calm and curious",
						"dev",
						"low",
						"senior"));

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
						"panic",
						"dev",
						"low",
						"senior"));

		assertThat(response.signal()).isEqualTo("shield-wall");
		assertThat(response.checklist()).first().isEqualTo("split the task");
		assertThat(response.reason()).contains("smaller slice");
	}

	@Test
	void returnsShieldWallDueToProductionMultiplier() {
		// Base score for this would be 4 (prod) - 2 (test) = 2 (truce)
		// But production multiplier (2.0) and junior multiplier (1.2)
		// and medium complexity (1.2) makes it 2 * 2 * 1.2 * 1.2 = 5.76 -> 5 (sparring)
		// Wait, let's make it more extreme to hit shield-wall (7+)
		// Base score: 4 (prod)
		// Multiplier: production (2.0) -> 8 (shield-wall)
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"prod change",
						"some move",
						"calm",
						"production",
						"low",
						"expert"));

		assertThat(response.signal()).isEqualTo("shield-wall");
	}
}
