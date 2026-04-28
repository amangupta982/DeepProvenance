<div align="center">

# 🔬 DeepProvenance

### AI-Powered Forgery Detection & Blockchain Provenance for Sports Media

*"Every pixel has a past. We prove it."*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Polygon zkEVM](https://img.shields.io/badge/Polygon-zkEVM-8247E5.svg?logo=polygon&logoColor=white)](https://polygon.technology)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636.svg?logo=solidity&logoColor=white)](https://soliditylang.org)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [ML Pipeline](#-ml-pipeline)
- [Smart Contract](#-smart-contract)
- [Frontend Pages](#-frontend-pages)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

AI-generated fake sports content — produced by models like Sora, Midjourney, and SDXL — is now **virtually indistinguishable** from authentic footage. This poses serious threats to sports organizations, broadcasters, and fans.

Existing detection tools fall short because:

1. **They require an original reference** — useless when verifying unseen content.
2. **They rely on face-trained models** — missing critical **sports-specific artifacts** such as grass textures, jersey physics, ball blur, crowd bokeh, and shadow angles.

---

## 💡 Solution Overview

DeepProvenance is a full-stack platform that combines **sports-specific AI forgery detection** with **blockchain-anchored Reality Certificates** to establish a verifiable chain of trust for digital media.

### Workflow

| Track | Description |
|---|---|
| **🟢 Official Content** | Photographer captures → ViT embedding extraction → Reality Certificate minted on Polygon zkEVM |
| **🔵 Reuse Detection** | Content uploaded → ANN similarity search against Content DNA Registry → Ownership & authorization verified |
| **🔴 Fake Detection** | Content uploaded → ViT classifier + Grad-CAM heatmap → AI/Real verdict with confidence score |

### Four Verdicts

| Verdict | Indicator | Meaning |
|---|---|---|
| **ORIGINAL VERIFIED** | 🟢 Green | Uploaded by owner, valid certificate, confirmed authentic |
| **VERIFIED REUSE** | 🔵 Cyan | Matches registered content, authorized user |
| **UNVERIFIED COPY** | 🟡 Amber | Matches registered content, unauthorized upload |
| **FAKE / AI MANIPULATED** | 🔴 Red | AI-generated content, no registry match |

---

## ✨ Key Features

- **Sports-Specific AI Detection** — ViT model fine-tuned on sports media artifacts (grass, jerseys, ball physics, crowd patterns, lighting, hands)
- **Grad-CAM Explainability** — Visual heatmaps highlighting exactly which regions are synthetic
- **Content DNA Registry** — 768-dimensional visual fingerprints stored in Pinecone vector database for similarity search
- **Blockchain Provenance** — Non-transferable (soulbound) ERC-721 Reality Certificates on Polygon zkEVM
- **Real-time Analytics** — Live monitoring dashboard with violation heatmaps and automated takedown tracking
- **Interactive Demo Mode** — Walk through 4 real-world scenarios without external dependencies
- **Developer API** — RESTful API with rate-limited keys and SDKs for Python/JavaScript
- **Forensic Reports** — PDF export with full chain-of-custody audit trail

---

## 🏗️ System Architecture

```
┌─────────────────┐       ┌───────────────────┐       ┌────────────────────┐
│                 │       │                   │       │                    │
│   React 18 UI   │──────▶│   FastAPI Server  │──────▶│   ViT Classifier   │
│  (Vite + TW +   │  API  │   + Celery Workers│  ML   │  (Forgery Detection│
│  Framer Motion) │       │                   │       │  + Grad-CAM)       │
│                 │       │                   │       │                    │
└─────────────────┘       └────────┬──────────┘       └────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
             ┌───────────┐  ┌───────────┐  ┌────────────┐
             │ PostgreSQL │  │ Pinecone  │  │  Polygon   │
             │  (Users,   │  │ (Content  │  │   zkEVM    │
             │ Certs, DB) │  │ DNA Vecs) │  │ (Soulbound │
             │            │  │           │  │  ERC-721)  │
             └───────────┘  └───────────┘  └────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Recharts, Zustand |
| **Backend** | Python 3.12, FastAPI, Celery, SQLAlchemy (async), Pydantic v2 |
| **ML/AI** | PyTorch, timm (ViT), pytorch-grad-cam, Pillow, OpenCV |
| **Blockchain** | Solidity 0.8.20, Hardhat, OpenZeppelin, Web3.py, Polygon zkEVM |
| **Storage** | PostgreSQL 16, Redis 7, MinIO (S3-compatible), Pinecone (Vector DB) |
| **DevOps** | Docker Compose, GitHub Actions (CI/CD), Alembic (migrations) |

---

## 📁 Project Structure

```
DeepProvenance/
│
├── frontend/                    # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── pages/               # 8 route pages
│   │   │   ├── Landing.tsx      # Hero, features, CTA
│   │   │   ├── Verify.tsx       # Image upload & verification
│   │   │   ├── Demo.tsx         # Interactive 4-scenario demo
│   │   │   ├── Dashboard.tsx    # Creator certificate management
│   │   │   ├── Analytics.tsx    # Real-time charts & live feed
│   │   │   ├── CertificateExplorer.tsx  # Certificate detail view
│   │   │   ├── Admin.tsx        # Moderation & takedown queue
│   │   │   └── Developer.tsx    # API docs & SDK reference
│   │   ├── components/layout/   # Navbar, Footer
│   │   ├── store/               # Zustand state management
│   │   ├── lib/                 # Constants, utilities, API client
│   │   └── types/               # TypeScript type definitions
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── backend/                     # FastAPI + Python 3.12
│   ├── app/
│   │   ├── main.py              # All API endpoints (auth, upload, cert, analytics, admin)
│   │   ├── config.py            # Pydantic Settings configuration
│   │   ├── database.py          # SQLAlchemy async engine
│   │   ├── ml/                  # ML inference (detector, DNA extractor, verdict engine)
│   │   ├── blockchain/          # Web3.py Polygon zkEVM integration
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic v2 request/response schemas
│   │   └── tasks/               # Celery async task definitions
│   ├── tests/                   # pytest unit & integration tests
│   ├── alembic/                 # Database migration scripts
│   ├── requirements.txt
│   └── Dockerfile
│
├── contracts/                   # Solidity + Hardhat
│   ├── contracts/
│   │   └── RealityCertificate.sol   # Soulbound ERC-721
│   ├── scripts/                 # Deployment scripts
│   ├── test/                    # Contract test suite
│   ├── hardhat.config.js
│   └── package.json
│
├── ml/                          # ML Training & Evaluation
│   ├── train.py                 # ViT fine-tuning script
│   ├── evaluate.py              # Evaluation pipeline (F1, AUC-ROC, precision, recall)
│   └── gradcam.py               # Grad-CAM visualization generator
│
├── .github/workflows/           # CI/CD Pipelines
│   ├── ci.yml                   # Lint, test, build on every push/PR
│   ├── cd.yml                   # Deploy pipeline
│   └── model-eval.yml           # ML model evaluation workflow
│
├── docker-compose.yml           # Full local dev environment (6 services)
├── Makefile                     # Developer convenience commands
├── .env.example                 # Environment variable template
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Node.js** | 20+ | Frontend & smart contract tooling |
| **Python** | 3.12+ | Backend API server |
| **Docker** | Latest | Infrastructure services (PostgreSQL, Redis, MinIO) |
| **Git** | Latest | Version control |

### 1. Clone the Repository

```bash
git clone https://github.com/deepprovenance/deepprovenance.git
cd deepprovenance
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your API keys (Pinecone, Polygon RPC, etc.)
# Default values work for local development with demo mode
```

### 3. Install Dependencies

```bash
# Install all dependencies (frontend + backend + contracts)
make install

# Or install individually:
cd frontend && npm install        # Frontend dependencies
cd backend && pip install -r requirements.txt   # Backend dependencies
cd contracts && npm install       # Smart contract dependencies
```

---

## ▶️ Running the Application

### Option A: Docker Compose (Recommended)

Spins up all services (PostgreSQL, Redis, MinIO, Backend, Celery, Frontend):

```bash
make docker-dev
# or
docker-compose up --build
```

### Option B: Individual Services

```bash
# Terminal 1 — Start infrastructure
docker-compose up -d postgres redis minio

# Terminal 2 — Start backend (port 8000)
cd backend && uvicorn app.main:app --reload --port 8000

# Terminal 3 — Start frontend (port 5173)
cd frontend && npm run dev
```

### Access Points

| Service | URL |
|---|---|
| **Frontend** | [http://localhost:5173](http://localhost:5173) |
| **API Documentation (Swagger)** | [http://localhost:8000/api/docs](http://localhost:8000/api/docs) |
| **API Documentation (ReDoc)** | [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc) |
| **MinIO Console** | [http://localhost:9001](http://localhost:9001) |

> **Note:** The application runs in **Demo Mode** by default (`DEMO_MODE=true`), which uses in-memory storage and simulated ML inference — no external services required.

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new creator account |
| `POST` | `/api/v1/auth/login` | Authenticate & receive JWT tokens |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |

### Upload & Verification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/upload/verify` | Upload image for AI verification |
| `GET` | `/api/v1/upload/result/{task_id}` | Poll for verification result |
| `POST` | `/api/v1/upload/mint` | Mint a Reality Certificate on-chain |
| `GET` | `/api/v1/upload/history` | Get upload history |

### Certificates

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/certificate/{hash}` | Get certificate details |
| `POST` | `/api/v1/certificate/{id}/authorize` | Grant user access |
| `DELETE` | `/api/v1/certificate/{id}/authorize/{user_id}` | Revoke user access |
| `GET` | `/api/v1/certificate/{id}/chain` | Get chain of custody |

### Analytics & ML

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/analytics/overview` | Platform analytics overview |
| `GET` | `/api/v1/analytics/heatmap` | Violation distribution by platform |
| `GET` | `/api/v1/analytics/audit/{upload_id}` | Asset audit trail |
| `GET` | `/api/v1/ml/model-stats` | Model accuracy metrics |
| `POST` | `/api/v1/ml/detect` | Run AI forgery detection (internal) |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/admin/takedown` | Initiate content takedown |
| `GET` | `/api/v1/admin/queue` | Get human review queue |
| `POST` | `/api/v1/admin/export/{upload_id}` | Generate forensic report PDF |

> Full interactive API documentation is available at `/api/docs` when the backend is running.

---

## 🤖 ML Pipeline

### Model Architecture

- **Base Model:** `google/vit-base-patch16-224` (Vision Transformer)
- **Task:** Binary classification — Real vs. AI-Generated sports media
- **Input:** 224×224 pixel patches
- **Output:** Confidence score (0–100%) + feature-level artifact scores

### Sports-Specific Artifact Detection

| Artifact | What the Model Detects |
|---|---|
| 🌿 **Grass Texture** | Unnatural repetition patterns, missing blades |
| 👕 **Jersey Physics** | Fabric draping errors, number distortions |
| ⚽ **Ball Blur** | Incorrect motion blur, floating artifacts |
| 👥 **Crowd Bokeh** | Unnatural depth of field, repeated faces |
| 💡 **Shadow/Lighting** | Inconsistent light sources, missing shadows |
| ✋ **Hands/Limbs** | Anatomical errors, extra fingers |

### Explainability

Grad-CAM heatmaps are generated to highlight suspicious regions:
- **Red zones** indicate high confidence of synthetic content
- **Yellow zones** indicate moderate anomaly
- **Heatmap opacity** is adjustable in the UI

### Training & Evaluation

```bash
# Fine-tune ViT model
cd ml && python train.py

# Evaluate model performance
cd ml && python evaluate.py

# Generate Grad-CAM visualizations
cd ml && python gradcam.py
```

---

## ⛓️ Smart Contract

### RealityCertificate.sol

A **non-transferable (soulbound) ERC-721** NFT deployed on Polygon zkEVM testnet.

| Feature | Detail |
|---|---|
| **Standard** | ERC-721 with transfer lock |
| **Storage** | Content hash, timestamp, device ID, creator address |
| **Protection** | Duplicate hash prevention |
| **Transfer** | Permanently locked (soulbound to creator) |
| **Gas Cost** | ~0.001 ETH per mint on zkEVM |

### Contract Functions

| Function | Access | Description |
|---|---|---|
| `mintCertificate()` | Owner only | Mint a new Reality Certificate |
| `getCertificate()` | Public | Retrieve certificate data by token ID |
| `getTokenByHash()` | Public | Look up token ID by content hash |
| `totalMinted()` | Public | Get total certificates minted |

```bash
# Compile contracts
cd contracts && npx hardhat compile

# Run contract tests
cd contracts && npx hardhat test

# Deploy to Polygon zkEVM testnet
cd contracts && npx hardhat run scripts/deploy.js --network polygonZkEvm
```

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Landing** | Hero section with animated counters, feature showcase, three verdict scenarios, and CTA |
| `/verify` | **Verify** | Drag-and-drop image upload with real-time processing pipeline, verdict card, Grad-CAM overlay, and report download |
| `/demo` | **Demo** | Interactive walkthrough of 4 predefined scenarios (Original, Verified Reuse, Unverified Copy, Fake) with animated results |
| `/dashboard` | **Dashboard** | Creator dashboard showing certificates, authorized users, quick upload, and recent activity |
| `/analytics` | **Analytics** | Real-time charts (30-day trends, verdict breakdown pie chart, platform violation bar chart) and live alert feed |
| `/certificate/:hash` | **Certificate Explorer** | Detailed certificate view with QR code, blockchain link, chain-of-custody timeline, embeddable badge, and exposure score |
| `/admin` | **Admin Panel** | Content moderation queue with search/filter, takedown actions, review workflow, and export capabilities |
| `/developer` | **Developer** | API documentation with code examples (cURL, Python, JavaScript), endpoint reference table, API key management, and rate limits |

---

## 🧪 Testing

```bash
# Run all tests
make test

# Backend unit + integration tests
make test-backend
# → pytest tests/ -v --tb=short

# Frontend build verification
make test-frontend

# Smart contract tests
make test-contracts
# → npx hardhat test

# ML model evaluation
make test-ml
# → python evaluate.py
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Trigger | Actions |
|---|---|---|
| **CI** (`ci.yml`) | Push / Pull Request | Lint (Ruff, ESLint), Type Check (MyPy), Backend Tests (pytest), Frontend Build, Contract Compilation |
| **CD** (`cd.yml`) | Push to `main` | Build Docker images, Deploy to production |
| **Model Eval** (`model-eval.yml`) | Manual / Schedule | Run ML evaluation pipeline, Report F1/AUC-ROC metrics |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for authentic sports media**

*DeepProvenance — because truth in sports matters.*

</div>
