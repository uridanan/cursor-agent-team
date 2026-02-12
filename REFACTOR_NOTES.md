# Refactor Notes

- Extracted `shortDescription` to `backend/src/utils/shortDescription.js`; reused in GooglePlayLookupService and AppleAppStoreLookupService (DRY).
- LookupController: safe read of `err.message` and treat "not found" as 400.
- No SOLID violations identified per @07-design-patterns.mdc.

## Icon Download (feature/download-app-icon)

- IconDownloadService: extracted `safeFilenameBase()` and `extensionFromTypeOrUrl()` for clarity and strict typing (JSDoc return types).
- AppLookupPage: icon download service injected via prop (D from SOLID); default instance for production.
