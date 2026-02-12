# App Store Lookup – Technical Spec

## Overview
Web app: input = Google Play or App Store URL; output = app icon, name, bundle ID, short description, developer info (name, website, email).

## API Definition Table

| Layer | Interface/Class | Methods | Purpose |
|-------|-----------------|---------|---------|
| Domain | `IDeveloperInfo` | (interface) `name: string; website?: string; email?: string` | Developer data shape |
| Domain | `IAppInfo` | (interface) `iconUrl, name, bundleId, shortDescription, developer: IDeveloperInfo` | App metadata shape |
| Service | `IAppStoreLookupService` | `getAppInfo(url: string): Promise<IAppInfo>` | Fetch app info from store URL |
| Service | `GooglePlayLookupService` | implements `IAppStoreLookupService` | Google Play implementation |
| Service | `AppleAppStoreLookupService` | implements `IAppStoreLookupService` | App Store implementation |
| Service | `AppStoreLookupServiceFactory` | `getService(url: string): IAppStoreLookupService` | Returns correct service by URL |
| Backend | `LookupController` | `lookup(req, res)` | HTTP handler for /api/lookup |
| Frontend | `AppLookupPage` | (component) | Page: input URL, display result; icon hover = download evident, click = download |
| Frontend | `useAppLookup` | (hook) `(url) => { fetch, result, error }` | Encapsulates API call + state |
| Frontend | `IIconDownloadService` | (interface) `download(iconUrl: string, appName: string): Promise<void>` | Triggers save of icon as \<app name\>.jpg or .png |
| Frontend | `IconDownloadService` | implements `IIconDownloadService` | Fetches icon URL, triggers browser download with sanitized filename |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default 5000) |
| `NODE_ENV` | No | development \| production |

## Infrastructure & Docker

| Item | Action |
|------|--------|
| `docker-compose.yml` | Create: `backend` (Node), `frontend` (React dev or nginx build) |
| Backend Dockerfile | Node alpine, CMD node server |
| Frontend Dockerfile | Multi-stage: build React, serve with nginx or node |
| Ports | Backend 5000, Frontend 3000 (dev) or 80 (prod) |
| .dockerignore | Exclude node_modules, .env, logs |
| .env.example | PORT, NODE_ENV |

## Data Flow
1. User enters URL in frontend.
2. Frontend calls `POST /api/lookup` with `{ url }`.
3. Backend parses URL, uses `AppStoreLookupServiceFactory.getService(url)` → `getAppInfo(url)`.
4. Response: `IAppInfo` JSON.
5. Frontend shows icon, name, bundleId, shortDescription, developer.

## Short Description Rule
Backend truncates description to 2–3 lines (e.g. first ~200 chars or first 3 newline-separated segments).

## Icon Download
- After lookup returns, user can download the app icon.
- Hover over icon: download possibility evident (cursor, visual cue).
- Click on icon: triggers download. Filename: `<app name>.jpg` or `<app name>.png` (extension from icon URL or default .png).
- No backend change; client-side only. No new env vars or Docker changes.
