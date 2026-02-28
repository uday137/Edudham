#!/bin/bash

# Get absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$PROJECT_ROOT/tools"
DATA_DIR="$PROJECT_ROOT/data/db"

# Set up paths for local binaries
export PATH="$TOOLS_DIR/node/bin:$TOOLS_DIR/mongodb/bin:$PATH"

echo "=== Setting up local environment ==="
echo "Node version: $(node -v)"
echo "Mongod version: $(mongod --version | head -n 1)"

# Start MongoDB
echo "=== Starting MongoDB ==="
if pgrep -f "mongod --dbpath" > /dev/null; then
    echo "MongoDB is already running."
else
    mongod --dbpath "$DATA_DIR" --logpath "$DATA_DIR/mongod.log" --fork
    echo "MongoDB started."
fi

# Install Frontend Dependencies if needed
echo "=== Checking Frontend Dependencies ==="
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd "$PROJECT_ROOT/frontend"
    npm install --legacy-peer-deps
    cd "$PROJECT_ROOT"
fi

# Start Backend
echo "=== Starting Backend ==="
if pgrep -f "uvicorn backend.server:app" > /dev/null; then
    echo "Backend is already running."
else
    source "$PROJECT_ROOT/venv/bin/activate"
    # Seed data if this is the first run (checked by looking for users collection)
    # We'll just run seed script safely as it clears old data
    # Database seeding is now disabled to prevent overwriting user data.
    # To re-seed, run: python "$PROJECT_ROOT/backend/seed_data.py"
    
    echo "Starting backend server..."
    nohup uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000 > "$PROJECT_ROOT/backend.log" 2>&1 &
    echo "Backend started on port 8000."
fi

# Start Frontend
echo "=== Starting Frontend ==="
cd "$PROJECT_ROOT/frontend"
echo "Starting frontend server..."
npm start
