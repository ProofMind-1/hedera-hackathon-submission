#!/bin/bash

echo "🚀 ProofMind Demo Test Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

PYTHON_CMD="python3"
if command -v python &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "✓ Python found: $($PYTHON_CMD --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent
cd backend && npm install --silent
cd ..

echo "✓ Dependencies installed"

# Start mock server in background
echo "🔧 Starting mock server..."
npx tsx mock-server.ts &
MOCK_PID=$!

# Wait for server to start
sleep 3

# Test API endpoint
echo "🧪 Testing API..."
RESPONSE=$(curl -s http://localhost:3001/api/v1/models)
if [[ $RESPONSE == *"credit_risk"* ]]; then
    echo "✓ API responding correctly"
else
    echo "❌ API test failed"
    kill $MOCK_PID
    exit 1
fi

# Test Python SDK
echo "🐍 Testing Python SDK..."
$PYTHON_CMD -c "
import sys, os
sys.path.append('backend/sdk/python')
from proofmind import ProofMind
pm = ProofMind('ent_demo', '0.0.12345', api_url='http://localhost:3001')
print('✓ Python SDK imported successfully')
"

if [ $? -eq 0 ]; then
    echo "✓ Python SDK test passed"
else
    echo "❌ Python SDK test failed"
fi

# Clean up
kill $MOCK_PID

echo ""
echo "🎉 Setup test complete!"
echo ""
echo "To start the demo:"
echo "1. npx tsx mock-server.ts    # In terminal 1"
echo "2. npm run dev               # In terminal 2" 
echo "3. python demo_generator.py  # In terminal 3"
echo ""
echo "Then visit: http://localhost:5173"