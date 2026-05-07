# statAssist (React + FastAPI)

statAssist is a guided machine learning learning studio focused on educational workflows.

## Foundation Documents

- Architecture: `docs/ARCHITECTURE.md`
- Execution roadmap: `docs/ROADMAP.md`

## Project Structure

```text
NoCodeML/
  backend/
    requirements.txt
    app/
      main.py
      api/
        routes/
          auth.py
          data.py
          model.py
          system.py
      core/
        config.py
      dependencies/
        state.py
      schemas/
        data_schema.py
        model_schema.py
      services/
        data_processing.py
        ml_models.py
      utils/
        sample_data.py
      data/
        sample_dataset.csv
  frontend/
    src/
      components/
      pages/
      services/
      hooks/
      utils/
      App.tsx
      main.tsx
```

## Backend Setup

```bash
cd backend
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload
```

Backend environment variables (optional for local):

- `DATABASE_URL` (default: `sqlite:///./nocodeml.db`)
- `FRONTEND_ORIGIN` (default: `http://localhost:5173`)
- `GOOGLE_CLIENT_ID` (required for Google login)

PostgreSQL example:

```bash
export DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/nocodeml'
```

Backend base URL:

- `http://127.0.0.1:8000`

API prefix:

- `http://127.0.0.1:8000/api/v1`

## Docker Setup (Backend + PostgreSQL)

1. Copy environment file at repository root:

```bash
cp .env.example .env
```

2. Build and start services:

```bash
docker compose up --build -d
```

3. Check backend health:

```bash
curl http://127.0.0.1:8000/
```

4. Stop services:

```bash
docker compose down
```

Useful command to also remove DB volume (fresh start):

```bash
docker compose down -v
```

Main endpoints:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/data/current`
- `POST /api/v1/data/upload`
- `POST /api/v1/data/process`
- `GET /api/v1/data/visualization`
- `POST /api/v1/model/train`
- `GET /api/v1/system/health/live`
- `GET /api/v1/system/health/ready`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend environment variables:

- `VITE_GOOGLE_CLIENT_ID` (required to display Google sign-in button)

Frontend URL:

- `http://localhost:5173`

The frontend is preconfigured to call:

- `http://127.0.0.1:8000/api/v1`

## Feature Flow

1. Register or log in (users persisted in database, session token stored in localStorage).
2. Follow the guided workflow: Overview -> Import Data -> Prepare Data -> Train Model -> Explain Results.
3. Continue iterating while preserving a clear instructional flow.

## Notes

- If no dataset is uploaded, backend seeds a sample dataset automatically.
- Current implementation stores datasets in memory for local development.
- Architecture is service-oriented so additional models/routes can be added without major refactor.

## Google Login Setup

1. Create Google OAuth 2.0 Web Client credentials in Google Cloud Console.
2. Add allowed JavaScript origin for local frontend (for example `http://localhost:5173`).
3. Set the same Google Client ID in both places:

```bash
# repository root .env (used by docker compose/backend)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# frontend/.env (used by Vite app)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

4. Restart backend/frontend after env changes.
