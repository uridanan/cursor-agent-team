# QA Report

## Test Results

| Test Suite | Test Name | Result |
|------------|-----------|--------|
| LookupController | lookup with body { url } sends 200 and app info shape | PASS |
| AppStoreLookupServiceFactory | getService(googlePlayUrl) returns instance of GooglePlayLookupService | PASS |
| AppStoreLookupServiceFactory | getService(appleUrl) returns instance of AppleAppStoreLookupService | PASS |
| GooglePlayLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | PASS |
| AppleAppStoreLookupService | getAppInfo returns object with iconUrl, name, bundleId, shortDescription, developer | PASS |
| AppLookupPage | renders url input and submit button | PASS |
| AppLookupPage | when result present, icon has download affordance | PASS |
| AppLookupPage | clicking icon triggers downloadAppIcon(iconUrl, name) | PASS |
| useAppLookup | returns fetchApp, result, and error | PASS |
| downloadAppIcon | fetches iconUrl, download .png/.jpg, default .png | PASS (3 cases) |

## Summary

- Backend: 5/5 passed
- Frontend: 7/7 passed (incl. icon download)
- Total: 12/12 passed

**PASS**
