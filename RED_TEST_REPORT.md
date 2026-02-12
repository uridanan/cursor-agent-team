# Red Test Report

## Test Cases

| Test Suite | Test Case | Result | Evidence |
|------------|-----------|--------|----------|
| LookupController | lookup with body { url } sends 200 and app info shape | FAIL | `Error: Not Implemented` at LookupController.js:6 |
| AppStoreLookupServiceFactory | getService(googlePlayUrl) returns instance of GooglePlayLookupService | FAIL | `Error: Not Implemented` at AppStoreLookupServiceFactory.js:9 |
| AppStoreLookupServiceFactory | getService(appleUrl) returns instance of AppleAppStoreLookupService | FAIL | `Error: Not Implemented` at AppStoreLookupServiceFactory.js:9 |
| GooglePlayLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | FAIL | `Error: Not Implemented` at GooglePlayLookupService.js:10 |
| AppleAppStoreLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | FAIL | `Error: Not Implemented` at AppleAppStoreLookupService.js:10 |
| AppLookupPage | renders url input and submit button | FAIL | `Error: Not Implemented` at AppLookupPage.jsx:2 |
| useAppLookup | returns fetchApp, result, and error | FAIL | `Error: Not Implemented` at useAppLookup.js:5 |

## Summary

- Backend: 5 tests failed (stubs throw "Not Implemented").
- Frontend: 2 tests failed (stubs throw "Not Implemented").

---

## Feature: Download Icon (feature/download-icon)

### Test Cases

| Test Suite | Test Case | Result | Evidence |
|------------|-----------|--------|----------|
| downloadAppIcon | fetches iconUrl and triggers download with app name and extension | FAIL | `Error: Not Implemented` at iconDownload.js:8 |
| downloadAppIcon | uses jpg extension when requested | FAIL | `Error: Not Implemented` at iconDownload.js:8 |
| AppLookupPage | shows icon with download affordance when result is present | FAIL | `expect(String(title)).toMatch(/download/i)` — title empty |
| AppLookupPage | calls downloadAppIcon when icon is clicked after result is loaded | FAIL | Component does not accept downloadAppIcon prop or wire click |

### Red Run Evidence

```
 FAIL  src/utils/iconDownload.test.js > downloadAppIcon > fetches iconUrl...
     → Not Implemented
 FAIL  src/utils/iconDownload.test.js > downloadAppIcon > uses jpg extension...
     → Not Implemented
 FAIL  src/components/AppLookupPage.test.jsx > ... shows icon with download affordance...
     → expect(received).toMatch(expected) — title does not match /download/i
 FAIL  src/components/AppLookupPage.test.jsx > ... calls downloadAppIcon when icon is clicked...
     → (once scoped) component does not call downloadAppIcon on icon click
```
