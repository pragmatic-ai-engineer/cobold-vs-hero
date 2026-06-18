from __future__ import annotations

import json
import os
import urllib.request
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class BriefingRequest:
    cobold_concern: str
    hero_move: str
    system_mood: str

    def to_payload(self) -> dict[str, str]:
        return {
            "coboldConcern": self.cobold_concern,
            "heroMove": self.hero_move,
            "systemMood": self.system_mood,
        }


class CoboldBriefingClient:
    def __init__(self, base_url: str | None = None) -> None:
        self.base_url = (base_url or os.getenv("COBOLD_API_BASE_URL") or "http://localhost:3000").rstrip("/")

    def get_status(self) -> dict[str, Any]:
        http_request = urllib.request.Request(
            f"{self.base_url}/api/cobold-vs-hero/status",
            method="GET",
        )

        with urllib.request.urlopen(http_request, timeout=5) as response:
            if response.status != 200:
                raise AssertionError(f"Expected HTTP 200, got {response.status}")
            return json.loads(response.read().decode("utf-8"))

    def create_briefing(self, request: BriefingRequest) -> dict[str, Any]:
        body = json.dumps(request.to_payload()).encode("utf-8")
        http_request = urllib.request.Request(
            f"{self.base_url}/api/cobold-vs-hero/briefing",
            data=body,
            headers={"content-type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(http_request, timeout=5) as response:
            if response.status != 200:
                raise AssertionError(f"Expected HTTP 200, got {response.status}")
            return json.loads(response.read().decode("utf-8"))
