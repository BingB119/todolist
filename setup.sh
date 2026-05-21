#!/bin/bash

echo "🚀 Setting up TodoList Application..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed or not in PATH. Please install MySQL and ensure it's running."
    echo "   You can continue with the setup, but you'll need to configure MySQL manually."
    read -p "Continue without MySQL check? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "📝 Configuration Instructions:"
echo "================================"
echo "1. Create MySQL database:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE todolist;"
echo ""
echo "2. Update backend/.env with your MySQL credentials:"
echo "   DB_HOST=localhost"
echo "   DB_USER=your_username"
echo "   DB_PASSWORD=your_password"
echo "   DB_NAME=todolist"
echo "   JWT_SECRET=your_secret_key"
echo ""
echo "3. Start the application:"
echo "   Terminal 1 (Backend): cd backend && npm run dev"
echo "   Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "🎉 Setup completed successfully!"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3000"