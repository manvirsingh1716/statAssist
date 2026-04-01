# ModelPath Architecture Foundation

## Product Direction

ModelPath is a guided machine learning learning studio. The core UX is a step-based workflow:

1. Overview
2. Import Data
3. Prepare Data
4. Train Model
5. Explain Results

## Backend Foundation

Current architecture target is a modular monolith with clear domain boundaries:

- `auth`: identity, login providers, user sessions
- `data`: dataset ingest, profiling, transformations
- `model`: baseline training and evaluation
- `system`: liveness/readiness probes and operational endpoints

Platform conventions:

- FastAPI router per domain under `app/api/routes`
- Pydantic settings under `app/core/config.py`
- SQLAlchemy session and models under `app/db` and `app/models`
- Health probes:
  - `GET /api/v1/system/health/live`
  - `GET /api/v1/system/health/ready`

## Frontend Foundation

UI should be built as a guided workspace, not a generic dashboard.

Design primitives:

- Workflow metadata in `src/config/workflow.ts`
- Shared workspace shell with persistent progress rail
- Reusable utility classes (`card-like`, `panel-grid`, `muted`)

## Scaling Path

1. Stage 1: modular monolith + Postgres + Redis + object storage
2. Stage 2: async workers for heavy jobs + read replicas
3. Stage 3: split into training service and analytics service only when bottlenecks are proven

## Build Principles

- Prefer explicit data contracts over dynamic payloads
- Keep domain services pure and testable
- Add observability before complexity
- Keep UX copy educational and action-oriented
