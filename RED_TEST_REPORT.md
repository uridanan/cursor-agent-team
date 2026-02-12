# Red Test Report

## Test Cases (baseline – prior implementations)

| Test Suite | Test Case | Result | Evidence |
|------------|-----------|--------|----------|
| LookupController | lookup with body { url } sends 200 and app info shape | PASS | (implemented) |
| AppStoreLookupServiceFactory | getService(googlePlayUrl) / getService(appleUrl) | PASS | (implemented) |
| GooglePlayLookupService / AppleAppStoreLookupService | getAppInfo shape | PASS | (implemented) |
| AppLookupPage | renders url input and submit button | PASS | (implemented) |
| useAppLookup | returns fetchApp, result, and error | PASS | (implemented) |

## Download icon feature (Red → Green)

| Test Suite | Test Case | Red Result | Evidence |
|------------|-----------|------------|----------|
| downloadAppIcon | fetches iconUrl, download with .png/.jpg, default .png | FAIL | `Error: Not Implemented` at iconDownload.js:7 |
| AppLookupPage | when result present, icon has download affordance | FAIL | expected null (no button/link with download) |
| AppLookupPage | clicking icon triggers downloadAppIcon(iconUrl, name) | FAIL | Unable to find button with name /download/i |

After Green phase: all above pass (utility implemented, icon wrapped in button with title/aria-label, click calls downloadAppIcon).

## Summary

- Baseline suite: all passing.
- Download icon: 5 tests written in Red, all passed after Green implementation.
