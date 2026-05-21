#!/bin/bash

echo "🚀 Starting TodoList Application in Development Mode..."
echo "======================================================="

echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting frontend development server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Servers are starting up..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔌 Backend API will be available at: http://localhost:3000"
echo ""
echo "To stop all servers, press Ctrl+C"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

wait