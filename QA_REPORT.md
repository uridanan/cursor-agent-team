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
| AppLookupPage | shows no icon when result is absent | PASS |
| AppLookupPage | shows icon with download affordance when result is present | PASS |
| AppLookupPage | calls downloadAppIcon when icon is clicked after result is loaded | PASS |
| useAppLookup | returns fetchApp, result, and error | PASS |
| downloadAppIcon | fetches iconUrl and triggers download with app name and extension | PASS |
| downloadAppIcon | uses jpg extension when requested | PASS |

## Summary

- Backend: 7/7 passed
- Frontend: 7/7 passed
- Total: 14/14 passed

**PASS**
