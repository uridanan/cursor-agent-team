# Refactor Notes

- Extracted `shortDescription` to `backend/src/utils/shortDescription.js`; reused in GooglePlayLookupService and AppleAppStoreLookupService (DRY).
- LookupController: safe read of `err.message` and treat "not found" as 400.
- No SOLID violations identified per @07-design-patterns.mdc.

## Download icon feature

- `downloadAppIcon` in `frontend/src/utils/iconDownload.js`: single responsibility (fetch + trigger download); UI injects via import (D). Filename sanitization for unsafe chars; extension from URL, default .png.
- AppLookupPage: icon wrapped in `<button>` with title/aria-label for accessibility; hover ring for affordance. No SOLID violations.
