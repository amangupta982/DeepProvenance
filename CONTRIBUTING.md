# Contributing to DeepProvenance

Thank you for your interest in contributing to DeepProvenance! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- **Node.js** 20+
- **Python** 3.12+
- **Docker & Docker Compose**
- **Git**

### Quick Setup

```bash
# Clone the repo
git clone https://github.com/deepprovenance/deepprovenance.git
cd deepprovenance

# Copy environment variables
cp .env.example .env

# Install all dependencies
make install

# Start development servers
make dev
```

## Code Style

### Backend (Python)
- **Formatter:** Ruff
- **Type Checker:** MyPy
- **Linting:** `cd backend && ruff check .`

### Frontend (TypeScript)
- **Linting:** ESLint with React plugin
- **Linting:** `cd frontend && npm run lint`

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add or update tests
chore: maintenance tasks
ci: CI/CD changes
refactor: code restructuring
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with clear commit messages
4. Run tests: `make test`
5. Run linting: `make lint`
6. Open a Pull Request with a clear description

## Testing

```bash
# Run all tests
make test

# Individual test suites
make test-backend     # pytest
make test-frontend    # Build check
make test-contracts   # Hardhat tests
make test-ml          # Model evaluation
```

## Questions?

Open a [GitHub Issue](https://github.com/deepprovenance/deepprovenance/issues) for bugs, feature requests, or questions.
