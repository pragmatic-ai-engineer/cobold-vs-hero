# UI Smoke

This folder is reserved for quick browser smoke checks used by developers and
manual testers.

The intended shape is a small Playwright suite that proves the deployed UI can
load, reach the BFF through `/api`, and render one briefing result. Keep this
lane fast and shallow; robust browser coverage belongs under
`testautomation/ui`.
