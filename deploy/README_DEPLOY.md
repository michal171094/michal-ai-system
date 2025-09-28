# Deployment Guide 🚀

This document walks through deploying the Michal AI system (Node.js web server + Python AI agent) to a production domain.

---

## 1. Prepare Environment Variables

Create separate `.env` files for **web** and **agent** services. Use the existing `.env` as a base, but make sure secrets are stored securely (Render/Railway dashboard). At minimum configure:

### Shared
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Web (`server-unified.js`)
- `PORT` (Render/Railway auto‑injects `PORT`)
- `AI_AGENT_URL` → `https://agent.your-domain.com`

### Agent (`smart_server.py`)
- `SMART_SERVER_HOST=0.0.0.0`
- `SMART_SERVER_PORT` (Render uses `$PORT` automatically)
- `ALLOWED_ORIGINS=https://app.your-domain.com`

---

## 2. Build Containers

Dockerfiles included under `deploy/`:

- `Dockerfile.web` – Node.js API/UI
- `Dockerfile.agent` – Python FastAPI AI service

For local testing:

```powershell
# Web
docker build -f deploy/Dockerfile.web -t michal-web .
docker run --rm -p 3000:3000 --env-file .env.production michal-web

# Agent
docker build -f deploy/Dockerfile.agent -t michal-agent .
docker run --rm -p 8000:8000 --env-file ai_agent/.env.production michal-agent
```

---

## 3. GitHub Actions Build Check (Optional but Recommended)

A workflow named **Render Build Check** lives in `.github/workflows/render-build.yml`.

It automatically runs on every push/PR to `main` (or manually through “Run workflow”) and ensures both Docker images still build before you deploy:

1. Open your GitHub repository → **Actions** → select “Render Build Check”.
2. Click **Run workflow** if you want to test manually, otherwise it runs on push.
3. Wait for the two jobs (`build-web`, `build-agent`) to pass.
4. Once green, you can safely trigger a new deployment in Render/Railway.

> Tip: if a build fails, open the job logs to see which Dockerfile needs attention before re-deploying.

---

## 3. GitHub Actions Build Check

A workflow named **Render Build Check** lives in `.github/workflows/render-build.yml`.

It automatically runs on every push/PR to `main` (or manually through "Run workflow") and ensures both Docker images still build before you deploy:

1. Open your GitHub repository → **Actions** → select "Render Build Check".
2. Click **Run workflow** if you want to test manually, otherwise it runs on push.
3. Wait for the two jobs (`build-web`, `build-agent`) to pass.
4. Once green, you can safely trigger a new deployment in Render/Railway.

> Tip: if a build fails, open the job logs to see which Dockerfile needs attention before re-deploying.

---

## 4. Deploy to Render (example)

1. Push repo to GitHub.
2. Create two **Web Services** in Render:
   - `michal-web` → build command `npm install`, start command `node server-unified.js`
   - `michal-agent` → build command `pip install -r requirements.txt`, start command `uvicorn ai_agent.smart_server:app --host 0.0.0.0 --port $PORT`
3. Provide environment variables for each service via Render dashboard.
4. Attach a custom domain per service (e.g., `app.michal.ai` and `agent.michal.ai`).

> Railway, Fly.io, or AWS App Runner are alternatives. Any platform that supports Docker or Node/Python runtimes works.

---

## 5. Configure DNS & HTTPS

1. Buy or reuse a domain (Namecheap, Cloudflare, etc.).
2. Add CNAME records:
   - `app` → Render web service URL
   - `agent` → Render agent service URL
3. Enable HTTPS (Render handles certificates automatically once DNS is verified).

---

## 6. Update Google OAuth redirect URI

1. Open Google Cloud Console → APIs & Services → Credentials.
2. Edit the OAuth client:
   - Authorized redirect URI: `https://app.your-domain.com/auth/google/callback`
3. Update `.env` values `GOOGLE_REDIRECT_URI` (web) and redeploy.

---

## 7. Point Frontend to Production Agent

In your web service environment variables set:

```
AI_AGENT_URL=https://agent.your-domain.com
```

The Node server forwards OCR/email requests to the agent service using this URL.

---

## 8. Post‑Deployment Checklist

- ✅ `https://app.your-domain.com` loads the dashboard
- ✅ Clicking "סנכרן Gmail" opens Google OAuth & works end-to-end
- ✅ Document uploads hit `/api/ocr/process` and complete successfully
- ✅ FastAPI docs reachable at `https://agent.your-domain.com/docs`
- ✅ Supabase queries succeed from both services
- ✅ Logs monitored (`Render Logs` or `Railway Observability`)

---

## 9. Optional: docker-compose (local/staging)

```yaml
version: "3.8"
services:
  web:
    build:
      context: .
      dockerfile: deploy/Dockerfile.web
    env_file: .env.production
    ports:
      - "3000:3000"
    environment:
      AI_AGENT_URL: "http://agent:8000"
    depends_on:
      - agent

  agent:
    build:
      context: .
      dockerfile: deploy/Dockerfile.agent
    env_file: ai_agent/.env.production
    ports:
      - "8000:8000"
```

Use `docker compose up --build` to run the full stack locally.

---

## 10. Maintenance Tips

- Rotate Google OAuth & Supabase keys periodically.
- Enable Render cron jobs for nightly database backups (Supabase already offers point-in-time recovery).
- Monitor logs for Gmail API quota errors.
- Set up uptime monitoring (Better Stack / Healthchecks).

Enjoy your production-ready Michal AI system! ✨
