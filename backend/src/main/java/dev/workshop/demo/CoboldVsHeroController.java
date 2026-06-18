package dev.workshop.demo;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cobold-vs-hero")
@CrossOrigin(origins = "http://localhost:4200")
class CoboldVsHeroController {

	private static final Map<String, List<String>> EVIDENCE_BY_SURFACE = Map.of(
			"backend", List.of("backend-test"),
			"bff", List.of("bruno-smoke"),
			"frontend", List.of("browser-screenshot"),
			"contract", List.of("bruno-smoke"),
			"testing", List.of("dps-testautomation"));

	private static final Map<String, List<String>> EVIDENCE_BY_RISK = Map.of(
			"production", List.of("dps-testautomation", "browser-screenshot"),
			"customer-data", List.of("dps-testautomation"),
			"auth", List.of("dps-testautomation"),
			"payment", List.of("dps-testautomation", "browser-screenshot"),
			"unclear-scope", List.of("hld", "lld"));

	private static final Set<String> HIGH_RISK_FLAGS = Set.of("production", "payment", "auth");

	private final int serverPort;

	CoboldVsHeroController(@Value("${server.port:8080}") int serverPort) {
		this.serverPort = serverPort;
	}

	@GetMapping("/status")
	StatusResponse status() {
		return new StatusResponse("be-java", "spring-boot", "UP", Instant.now().toString(), serverPort);
	}

	@PostMapping("/briefing")
	BriefingResponse createBriefing(@Valid @RequestBody BriefingRequest request) {
		List<String> requiredEvidence = requiredEvidenceFor(request);
		List<String> missingEvidence = missingEvidenceFor(requiredEvidence, request.providedEvidence());
		String signal = signalFor(missingEvidence, request.riskFlags());

		return new BriefingResponse(
				signal,
				headlineFor(signal),
				requiredEvidence,
				missingEvidence,
				stopConditionFor(signal),
				heroNextStepFor(signal),
				reviewMatrixFor(request));
	}

	private List<String> requiredEvidenceFor(BriefingRequest request) {
		LinkedHashSet<String> requiredEvidence = new LinkedHashSet<>();

		for (String surface : request.affectedSurfaces()) {
			requiredEvidence.addAll(EVIDENCE_BY_SURFACE.getOrDefault(surface, List.of()));
		}
		if (request.affectedSurfaces().size() > 1) {
			requiredEvidence.add("hld");
			requiredEvidence.add("lld");
		}
		for (String riskFlag : request.riskFlags()) {
			requiredEvidence.addAll(EVIDENCE_BY_RISK.getOrDefault(riskFlag, List.of()));
		}

		return new ArrayList<>(requiredEvidence);
	}

	private List<String> missingEvidenceFor(List<String> requiredEvidence, List<String> providedEvidence) {
		Set<String> provided = new LinkedHashSet<>(providedEvidence);

		return requiredEvidence.stream()
				.filter(evidence -> !provided.contains(evidence))
				.toList();
	}

	private String signalFor(List<String> missingEvidence, List<String> riskFlags) {
		boolean highRiskMissingProof = !missingEvidence.isEmpty() && riskFlags.stream().anyMatch(HIGH_RISK_FLAGS::contains);

		if (missingEvidence.size() > 2 || highRiskMissingProof) {
			return "shield-wall";
		}
		if (!missingEvidence.isEmpty() || riskFlags.stream().anyMatch(HIGH_RISK_FLAGS::contains)) {
			return "sparring";
		}
		return "truce";
	}

	private List<ReviewMatrixRow> reviewMatrixFor(BriefingRequest request) {
		Set<String> provided = new LinkedHashSet<>(request.providedEvidence());

		return request.affectedSurfaces().stream()
				.map(surface -> matrixRowFor(surface, provided))
				.toList();
	}

	private ReviewMatrixRow matrixRowFor(String surface, Set<String> provided) {
		List<String> expectedEvidence = EVIDENCE_BY_SURFACE.getOrDefault(surface, List.of());
		List<String> matchingEvidence = expectedEvidence.stream()
				.filter(provided::contains)
				.toList();
		List<String> missingEvidence = expectedEvidence.stream()
				.filter(evidence -> !provided.contains(evidence))
				.toList();
		String gap = missingEvidence.isEmpty() ? "covered" : "missing " + String.join(", ", missingEvidence);

		return new ReviewMatrixRow(surface, expectedEvidence, matchingEvidence, gap, nextActionForSurface(surface, missingEvidence.isEmpty()));
	}

	private String headlineFor(String signal) {
		return switch (signal) {
			case "shield-wall" -> "Split before review.";
			case "sparring" -> "Useful slice, but evidence is incomplete.";
			default -> "Review-ready starter slice.";
		};
	}

	private String stopConditionFor(String signal) {
		return switch (signal) {
			case "shield-wall" -> "Split the work before implementation; required evidence is missing for a high-risk or broad change.";
			case "sparring" -> "Do not request implementation review until API smoke and browser evidence are planned.";
			default -> "No stop condition triggered; keep the evidence attached to the review.";
		};
	}

	private String heroNextStepFor(String signal) {
		return switch (signal) {
			case "shield-wall" -> "Split the task and add automation, browser, and design evidence before implementation.";
			case "sparring" -> "Add Bruno smoke and browser evidence before implementation review.";
			default -> "Implement the small slice and keep the backend test visible in the PR.";
		};
	}

	private String nextActionForSurface(String surface, boolean covered) {
		if (covered) {
			return switch (surface) {
				case "backend" -> "Keep backend assertion attached to the PR.";
				case "bff" -> "Keep Bruno smoke evidence attached to the PR.";
				case "frontend" -> "Keep browser evidence attached to the PR.";
				case "contract" -> "Keep contract smoke evidence attached to the PR.";
				case "testing" -> "Keep DPS-lite evidence attached to the PR.";
				default -> "Keep evidence attached to the PR.";
			};
		}

		return switch (surface) {
			case "backend" -> "Add focused backend test evidence.";
			case "bff" -> "Add Bruno smoke coverage for the BFF mapping.";
			case "frontend" -> "Capture browser evidence for the rendered matrix.";
			case "contract" -> "Prove the contract through a smoke request.";
			case "testing" -> "Add DPS-lite automation before implementation review.";
			default -> "Add evidence for this surface.";
		};
	}

	record BriefingRequest(
			@NotBlank String changeTitle,
			@NotBlank String changeDescription,
			@NotEmpty List<String> affectedSurfaces,
			List<String> providedEvidence,
			List<String> riskFlags) {
	}

	record BriefingResponse(
			String signal,
			String headline,
			List<String> requiredEvidence,
			List<String> missingEvidence,
			String stopCondition,
			String heroNextStep,
			List<ReviewMatrixRow> reviewMatrix) {
	}

	record ReviewMatrixRow(
			String surface,
			List<String> expectedEvidence,
			List<String> providedEvidence,
			String gap,
			String nextAction) {
	}

	record StatusResponse(
			String service,
			String runtime,
			String status,
			String checkedAt,
			int port) {
	}
}
