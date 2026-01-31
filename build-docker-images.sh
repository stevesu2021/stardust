#!/bin/bash
# Build script for Stardust Docker images
# This script builds the backend and frontend locally first, then creates Docker images

set -e

PROJECT_ROOT="/home/steve/github/stardust"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "=========================================="
echo "Building Stardust Docker Images"
echo "=========================================="

# Build backend locally first
echo ""
echo "Step 1: Building backend locally..."
cd "$BACKEND_DIR"
npm install
npm run build
echo "Backend build completed!"

# Build frontend locally first
echo ""
echo "Step 2: Building frontend locally..."
cd "$FRONTEND_DIR"
npm install
npm run build:h5
echo "Frontend build completed!"

# Build Docker images
echo ""
echo "Step 3: Building Docker images..."
cd "$BACKEND_DIR"
docker build -t stardust-backend:latest .

cd "$FRONTEND_DIR"
docker build -t stardust-frontend:latest .

echo ""
echo "=========================================="
echo "Docker images built successfully!"
echo "=========================================="
echo ""
echo "Available images:"
echo "  - stardust-backend:latest"
echo "  - stardust-frontend:latest"
