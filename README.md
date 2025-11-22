<div align="center">
<h1>DysLearnAI</h1>
<p><em>Assistive AI platform with adaptive reading, chat, and personalization features for dyslexia and learning accessibility.</em></p>
</div>

## Table of Contents
1. Overview
2. Core Features
3. Architecture
4. Tech Stack
5. Folder Structure
6. Local Development Setup
7. Environment Variables
8. Auth0 Configuration
9. Supabase Configuration & Migrations
10. Running the Stack
11. Chat Persistence Flow
12. Security Practices (Important!)
13. Optional: Auth0 Branding Script
14. Troubleshooting
15. Production Considerations
16. Roadmap / Future Ideas

## 1. Overview
DysLearnAI provides an accessible interface for students or users with reading challenges. It includes a chat assistant, summarization, notes, visual crowding screener, font customization, and mind mapping.

## 2. Core Features
- Chat assistant with multi-turn conversation persistence per user.
- Mind map panel generated from conversation context (extensible).
- Summarizer tool for uploaded or pasted content.
- Notes management and questionnaire / screener for personalization.
- Font and spacing customization (Dyslexic-friendly toggle + visual crowding screener).
- Auth0-based authentication (SPA Universal Login).
- Supabase-backed chat and message storage keyed by Auth0 `sub`.

## 3. Architecture
| Layer | Purpose |
|-------|---------|
| React (Vite) | Frontend UI/UX, tools, chat interface |
| Auth0 | Authentication & user identity (provides `sub`, `email`) |
| Express API | Verifies Auth0 JWT, writes/reads chats & messages |
| Supabase Postgres | Persistent storage (tables: `ext_chats`, `ext_messages`) |

## 4. Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Auth0 React SDK
- Express + jsonwebtoken + jwks-rsa
- Supabase JS SDK (service role in backend, anon in frontend for other optional libs)
- Mermaid (mind map/diagram potential), lucide-react icons

## 5. Folder Structure (key parts)
```
src/
  App.tsx                # Root application logic
  main.tsx               # Auth0Provider + root render
  components/            # UI components (Sidebar, ChatArea, etc.)
  services/              # API helpers (chatApi.ts, openRouter, tts, etc.)
  lib/                   # Supabase client, screener store
server/
  index.mjs              # Express API (JWT verification, chat endpoints)
supabase/
  migrations/            # SQL migration files
scripts/
  update-auth0-branding.mjs  # Optional branding automation script
```

## 6. Local Development Setup
Prerequisites:
- Node.js 18+
- Auth0 tenant & application
- Supabase project

## 7. Environment Variables
Create `.env` from `.env.example` (do NOT commit real secrets):
```
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID
# Optional if you created an API identifier:
VITE_AUTH0_AUDIENCE=https://your-api-identifier

VITE_API_BASE=http://localhost:8787/api

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Server-only (never commit)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```
Restart dev servers after editing `.env`.

## 8. Auth0 Configuration
1. Create a SPA application.
2. Set Allowed Callback URLs, Logout URLs, Web Origins to your dev origin: `http://localhost:5173`.
3. (Optional) Create an API in Auth0 for Access Tokens (Identifier e.g. `https://dyslearnai.api`).
4. Use RS256 (default). Note your Domain and Client ID.

## 9. Supabase Configuration & Migrations
1. Obtain project URL and anon key.
2. Create a service role key (keep private on backend only).
3. Apply migration: `supabase/migrations/20251122120000_add_ext_chat_tables.sql`.
   - Tables:
     - `ext_chats(id uuid pk, user_sub text, title text, created_at, updated_at)`
     - `ext_messages(id uuid pk, chat_id uuid fk, role text, content text, created_at)`
4. RLS disabled (API uses service role). For public demo mode, consider enabling RLS + safe policies.

## 10. Running the Stack
PowerShell examples:
```powershell
# Install dependencies
npm install

# Start API server (reads .env)
$env:PORT=8787; node server/index.mjs

# Separate terminal: start frontend
npm run dev
```
Visit `http://localhost:5173`.

Health check:
```powershell
Invoke-WebRequest http://localhost:8787/api/health | Select-Object -ExpandProperty Content
```

## 11. Chat Persistence Flow
1. User logs in via Auth0.
2. Frontend requests access token silently.
3. Frontend calls `/api/chats` with Bearer token.
4. Express verifies JWT via JWKS from Auth0.
5. Express uses Supabase service role key to query `ext_chats` filtered by `user_sub`.
6. New chats created with POST `/api/chats` → row inserted → returned to client.
7. Messages appended via POST `/api/chats/:id/messages`.

## 12. Security Practices (Important!)
- NEVER commit real `SUPABASE_SERVICE_ROLE_KEY`.
- Rotate keys immediately if exposed.
- Consider enabling RLS and using a custom JWT integration mapping Auth0 `sub` if moving to direct Supabase client writes.
- Keep Management API credentials out of the repo; use environment variables in CI/CD.

## 13. Optional: Auth0 Branding Script
`scripts/update-auth0-branding.mjs` updates Universal Login colors/logo.
```powershell
$env:AUTH0_MGMT_DOMAIN='your-tenant.us.auth0.com'
$env:AUTH0_MGMT_CLIENT_ID='YOUR_M2M_CLIENT_ID'
$env:AUTH0_MGMT_CLIENT_SECRET='YOUR_M2M_CLIENT_SECRET'
$env:AUTH0_BRAND_PRIMARY='#8B5CF6'
$env:AUTH0_BRAND_BACKGROUND='#FFFFF0'
npm run auth0:brand
```

## 14. Troubleshooting
- White page: missing `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID` → check console.
- 401 errors: audience mismatch or API not created in Auth0.
- Chat not saving: verify server running; check Network tab POST `/api/chats`.
- Supabase errors: confirm URL/key correctness; rotate service role if any suspicion.

## 15. Production Considerations
- Build frontend: `npm run build` → deploy `dist/`.
- Host API separately; set environment vars via hosting provider secrets.
- Add HTTPS; update Auth0 allowed URLs to production domains.
- Implement logging & monitoring (e.g., Winston, structured logs, error tracking).

## 16. Roadmap / Future Ideas
- RLS + direct Supabase writes using a custom Auth0 → Supabase JWT bridge.
- Offline caching & optimistic sync of messages.
- Analytics & usage dashboard (per user and global).
- Advanced reading assist (live syllable highlighting, eye-tracking integration).
- Export chats to PDF/Markdown.

---
Maintained with a focus on accessibility and low friction setup. Please open issues or PRs for improvements.
