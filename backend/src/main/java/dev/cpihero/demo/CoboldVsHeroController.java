package dev.cpihero.demo;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cobold-vs-hero")
@CrossOrigin(origins = "http://localhost:4200")
class CoboldVsHeroController {

	@PostMapping("/briefing")
	BriefingResponse createBriefing(@Valid @RequestBody BriefingRequest request) {
		int risk = riskScore(request);
		String signal = risk >= 7 ? "shield-wall" : risk >= 4 ? "sparring" : "truce";

		return new BriefingResponse(
				signal,
				headlineFor(signal),
				coboldWisdomFor(request),
				heroNextStepFor(signal),
				checklistFor(signal));
	}

	private int riskScore(BriefingRequest request) {
		String concern = request.coboldConcern().toLowerCase();
		String move = request.heroMove().toLowerCase();
		String mood = request.systemMood().toLowerCase();
		int score = 0;

		if (concern.contains("prod") || concern.contains("release") || concern.contains("payment")) {
			score += 4;
		}
		if (concern.contains("mainframe") || concern.contains("copybook") || concern.contains("jcl") || concern.contains("batch")) {
			score += 2;
		}
		if (concern.contains("legacy") || concern.contains("migration") || concern.contains("refactor")) {
			score += 3;
		}
		if (mood.contains("panic") || mood.contains("chaos") || mood.contains("tired")) {
			score += 3;
		}
		if (move.contains("small") || move.contains("test") || move.contains("review") || move.contains("adapter")) {
			score -= 2;
		}

		return Math.max(score, 0);
	}

	private String headlineFor(String signal) {
		return switch (signal) {
			case "shield-wall" -> "Cobold cave alarm: shrink the quest before anyone touches production.";
			case "sparring" -> "Friendly duel: the idea is useful, but it needs sharper acceptance criteria.";
			default -> "Truce declared: this is a safe starter slice for the Hero team.";
		};
	}

	private String coboldWisdomFor(BriefingRequest request) {
		return "The Cobold team says: protect the legacy path, name the risky assumption, and keep " +
				request.coboldConcern().trim() + " visible in the review.";
	}

	private String heroNextStepFor(String signal) {
		return switch (signal) {
			case "shield-wall" -> "Write non-goals, split the change, and ask for a review plan before implementation.";
			case "sparring" -> "Add one targeted test and one reviewer note before opening the MR.";
			default -> "Inspect nearby code, make the smallest diff, and verify it before the MR.";
		};
	}

	private List<String> checklistFor(String signal) {
		return switch (signal) {
			case "shield-wall" -> List.of("split the task", "define rollback evidence", "request fresh-context review");
			case "sparring" -> List.of("write acceptance criteria", "run targeted tests", "explain the risky assumption");
			default -> List.of("inspect nearby code", "make a small change", "attach verification evidence");
		};
	}

	record BriefingRequest(
			@NotBlank String coboldConcern,
			@NotBlank String heroMove,
			@NotBlank String systemMood) {
	}

	record BriefingResponse(
			String signal,
			String headline,
			String coboldWisdom,
			String heroNextStep,
			List<String> checklist) {
	}
}
