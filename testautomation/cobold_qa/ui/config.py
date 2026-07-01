from cobold_qa.ui.poms import briefing_pom


class TestCaseCfg:
    test_case_cfg = {
        "drivers": [
            {
                "poms": briefing_pom,
                "driver_cfg": {
                    "type": "WEB",
                    "sub_type": "CHROMIUM",
                    "path": "http://localhost:4200",
                    "name": "Cobold vs Hero UI",
                },
            }
        ],
        "labels": {
            "test_level": "SYSTEM",
            "test_type": ["FUNCTIONAL"],
            "project": "COBOLD_VS_HERO",
            "systems": ["FRONTEND", "BFF", "BACKEND"],
            "test_object": "BRIEFING_UI",
            "workflow": ["BRIEFING"],
        },
    }
