package dev.workshop.demo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

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
	void returnsTruceWhenRequiredEvidenceIsCovered() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"Backend label endpoint",
						"Add one small backend endpoint and attach the backend unit test.",
						List.of("backend"),
						List.of("backend-test"),
						List.of()));

		assertThat(response.signal()).isEqualTo("truce");
		assertThat(response.requiredEvidence()).containsExactly("backend-test");
		assertThat(response.missingEvidence()).isEmpty();
		assertThat(response.reviewMatrix()).first()
				.extracting(CoboldVsHeroController.ReviewMatrixRow::gap)
				.isEqualTo("covered");
	}

	@Test
	void returnsSparringWhenUsefulSliceHasMissingUiAndBffEvidence() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"Status panel mapping",
						"Add one backend field, one BFF mapper, and one Angular status panel.",
						List.of("backend", "bff", "frontend"),
						List.of("backend-test", "hld", "lld"),
						List.of()));

		assertThat(response.signal()).isEqualTo("sparring");
		assertThat(response.requiredEvidence()).containsExactly("backend-test", "bruno-smoke", "browser-screenshot", "hld", "lld");
		assertThat(response.missingEvidence()).containsExactly("bruno-smoke", "browser-screenshot");
		assertThat(response.heroNextStep()).contains("browser evidence");
	}

	@Test
	void returnsShieldWallWhenProductionRollbackEvidenceIsMissing() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"Production release without rollback",
						"Deploy a production payment retry fix with test and browser evidence but no rollback path.",
						List.of("backend", "bff", "frontend", "contract", "testing"),
						List.of("backend-test", "bruno-smoke", "dps-testautomation", "browser-screenshot", "hld", "lld"),
						List.of("production")));

		assertThat(response.signal()).isEqualTo("shield-wall");
		assertThat(response.requiredEvidence()).containsExactly(
				"backend-test",
				"bruno-smoke",
				"browser-screenshot",
				"dps-testautomation",
				"hld",
				"lld",
				"rollback");
		assertThat(response.missingEvidence()).containsExactly("rollback");
		assertThat(response.stopCondition()).contains("production", "rollback");
		assertThat(response.heroNextStep()).contains("rollback");
		assertThat(response.reviewMatrix()).hasSize(5);
		assertThat(response.reviewMatrix())
				.allSatisfy(row -> assertThat(row.gap()).isEqualTo("covered"));
	}

	@Test
	void returnsShieldWallWhenHighRiskWorkMissesRequiredProof() {
		CoboldVsHeroController.BriefingResponse response = controller.createBriefing(
				new CoboldVsHeroController.BriefingRequest(
						"Payment retry refactor",
						"Refactor production payment retry flow and auth callback in one release.",
						List.of("backend", "bff", "frontend", "contract", "testing"),
						List.of("hld"),
						List.of("production", "payment", "auth", "unclear-scope")));

		assertThat(response.signal()).isEqualTo("shield-wall");
		assertThat(response.missingEvidence()).containsExactly(
				"backend-test",
				"bruno-smoke",
				"browser-screenshot",
				"dps-testautomation",
				"lld",
				"rollback");
		assertThat(response.stopCondition()).contains("Split the work");
		assertThat(response.reviewMatrix()).hasSize(5);
	}
}
