# App Store Lookup – Technical Spec

## Overview

Web app: input = Google Play or App Store URL; output = app icon, name, bundle ID, short description, developer info (name, website, email).

## API Definition Table


| Layer    | Interface/Class                | Methods                                                                            | Purpose                         |
| -------- | ------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------- |
| Domain   | `IDeveloperInfo`               | (interface) `name: string; website?: string; email?: string`                       | Developer data shape            |
| Domain   | `IAppInfo`                     | (interface) `iconUrl, name, bundleId, shortDescription, developer: IDeveloperInfo` | App metadata shape              |
| Service  | `IAppStoreLookupService`       | `getAppInfo(url: string): Promise<IAppInfo>`                                       | Fetch app info from store URL   |
| Service  | `GooglePlayLookupService`      | implements `IAppStoreLookupService`                                                | Google Play implementation      |
| Service  | `AppleAppStoreLookupService`   | implements `IAppStoreLookupService`                                                | App Store implementation        |
| Service  | `AppStoreLookupServiceFactory` | `getService(url: string): IAppStoreLookupService`                                  | Returns correct service by URL  |
| Backend  | `LookupController`             | `lookup(req, res)`                                                                 | HTTP handler for /api/lookup    |
| Frontend | `AppLookupPage`                | (component)                                                                        | Page: input URL, display result |
| Frontend | `useAppLookup`                 | (hook) `(url) => { fetch, result, error }`                                         | Encapsulates API call + state   |


## Environment Variables


| Variable   | Required | Description                |
| ---------- | -------- | -------------------------- |
| `PORT`     | No       | Server port (default 5000) |
| `NODE_ENV` | No       | development | production   |


## Infrastructure & Docker


| Item                 | Action                                                          |
| -------------------- | --------------------------------------------------------------- |
| `docker-compose.yml` | Create: `backend` (Node), `frontend` (React dev or nginx build) |
| Backend Dockerfile   | Node alpine, CMD node server                                    |
| Frontend Dockerfile  | Multi-stage: build React, serve with nginx or node              |
| Ports                | Backend 5000, Frontend 3000 (dev) or 80 (prod)                  |
| .dockerignore        | Exclude node_modules, .env, logs                                |
| .env.example         | PORT, NODE_ENV                                                  |


## Data Flow

1. User enters URL in frontend.
2. Frontend calls `POST /api/lookup` with `{ url }`.
3. Backend parses URL, uses `AppStoreLookupServiceFactory.getService(url)` → `getAppInfo(url)`.
4. Response: `IAppInfo` JSON.
5. Frontend shows icon, name, bundleId, shortDescription, developer.

## Short Description Rule

Backend truncates description to 2–3 lines (e.g. first ~200 chars or first 3 newline-separated segments).

## Lookup History Feature

### Overview

App-level (not user-based) persistent history of every successful lookup. Stored in SQLite via `better-sqlite3`.

### Storage

- **Engine**: SQLite (file: `data/history.db`)
- **Table**: `lookup_history`


| Column              | Type    | Constraint                         |
| ------------------- | ------- | ---------------------------------- |
| `id`                | INTEGER | PRIMARY KEY AUTOINCREMENT          |
| `url`               | TEXT    | NOT NULL                           |
| `store`             | TEXT    | NOT NULL (`google_play` | `apple`) |
| `icon_url`          | TEXT    |                                    |
| `name`              | TEXT    |                                    |
| `bundle_id`         | TEXT    |                                    |
| `short_description` | TEXT    |                                    |
| `developer_name`    | TEXT    |                                    |
| `developer_website` | TEXT    |                                    |
| `developer_email`   | TEXT    |                                    |
| `looked_up_at`      | TEXT    | NOT NULL (ISO 8601)                |


### API Additions


| Method | Endpoint           | Purpose                         |
| ------ | ------------------ | ------------------------------- |
| GET    | `/api/history`     | List all lookups (newest first) |
| DELETE | `/api/history/:id` | Delete a single entry           |
| DELETE | `/api/history`     | Clear all history               |


### Modified Behaviour

- `POST /api/lookup` now saves successful results to history before responding.

### Architecture Additions


| Layer      | Interface/Class     | Methods                                                     | Purpose                           |
| ---------- | ------------------- | ----------------------------------------------------------- | --------------------------------- |
| Repository | `HistoryRepository` | `save(entry)`, `findAll()`, `deleteById(id)`, `deleteAll()` | SQLite CRUD for history           |
| Controller | `HistoryController` | `list(req,res)`, `remove(req,res)`, `clear(req,res)`        | HTTP handlers for history         |
| Frontend   | `useHistory`        | (hook) `{ history, refresh, removeEntry, clearAll }`        | Fetch/manage history state        |
| Frontend   | `HistoryPanel`      | (component)                                                 | Renders history list with actions |


### Data Flow (History)

1. `LookupController.lookup` succeeds → calls `HistoryRepository.save(...)`.
2. Frontend `HistoryPanel` calls `GET /api/history` on mount and after each lookup.
3. User can click a history entry to re-populate the result view.
4. User can delete individual entries or clear all.

