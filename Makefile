.PHONY: dev test build deploy seed-db clean install frontend backend contracts

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DeepProvenance — Development Commands
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ── Install ───────────────────────────────────────────
install:
	@echo "📦 Installing all dependencies..."
	cd frontend && npm install
	cd backend && pip install -r requirements.txt
	cd contracts && npm install

## ── Development ───────────────────────────────────────
dev:
	@echo "🚀 Starting all services..."
	docker-compose up -d postgres redis minio
	@sleep 3
	@make backend &
	@make frontend &
	@wait

frontend:
	@echo "⚛️  Starting frontend..."
	cd frontend && npm run dev

backend:
	@echo "🐍 Starting backend..."
	cd backend && uvicorn app.main:app --reload --port 8000

celery:
	@echo "📋 Starting Celery worker..."
	cd backend && celery -A app.tasks.celery_app worker --loglevel=info

## ── Docker ────────────────────────────────────────────
docker-dev:
	@echo "🐳 Starting full Docker environment..."
	docker-compose up --build

docker-down:
	@echo "🛑 Stopping all containers..."
	docker-compose down

## ── Database ──────────────────────────────────────────
db-migrate:
	@echo "🗄️  Running database migrations..."
	cd backend && alembic upgrade head

db-revision:
	@echo "📝 Creating new migration..."
	cd backend && alembic revision --autogenerate -m "$(msg)"

seed-db:
	@echo "🌱 Seeding database with demo data..."
	cd backend && python -m app.seed

## ── Testing ───────────────────────────────────────────
test:
	@echo "🧪 Running all tests..."
	@make test-backend
	@make test-frontend
	@make test-contracts

test-backend:
	@echo "🐍 Running backend tests..."
	cd backend && pytest tests/ -v --tb=short

test-frontend:
	@echo "⚛️  Running frontend tests..."
	cd frontend && npm run test

test-contracts:
	@echo "⛓️  Running contract tests..."
	cd contracts && npx hardhat test

test-ml:
	@echo "🤖 Running ML evaluation..."
	cd ml && python evaluate.py

## ── Build ─────────────────────────────────────────────
build:
	@echo "🔨 Building for production..."
	cd frontend && npm run build
	docker-compose build

## ── Lint ──────────────────────────────────────────────
lint:
	@echo "🔍 Linting all code..."
	cd frontend && npm run lint
	cd backend && ruff check .
	cd backend && mypy app/

## ── Deploy ────────────────────────────────────────────
deploy:
	@echo "🚀 Deploying to production..."
	@make build
	@echo "Deploy steps configured in CI/CD pipeline"

## ── Contracts ─────────────────────────────────────────
contracts:
	@echo "⛓️  Compiling contracts..."
	cd contracts && npx hardhat compile

contracts-deploy:
	@echo "⛓️  Deploying to Polygon zkEVM testnet..."
	cd contracts && npx hardhat run scripts/deploy.js --network polygonZkEvm

## ── Clean ─────────────────────────────────────────────
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf frontend/dist
	rm -rf backend/__pycache__
	docker-compose down -v
	@echo "✅ Clean complete"
