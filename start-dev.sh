#!/bin/bash

# Contract Analyzer - Reliable Development Startup Script
# This script ensures a clean startup by killing processes and clearing cache

echo "🚀 Starting Contract Analyzer Development Environment"
echo "================================================"

# Kill any existing processes on ports 3000 and 3001
echo "📋 Checking for existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "   ✓ Port 3000 is free"
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "   ✓ Port 3001 is free"

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next
echo "   ✓ .next folder cleared"

# Clear npm cache (optional but helpful)
echo "🧹 Clearing npm cache..."
npm cache clean --force 2>/dev/null || echo "   ✓ npm cache already clean"

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Start the development server
echo "🚀 Starting development server on port 3001..."
echo "   Local:   http://localhost:3001"
echo "   Network: http://$(ipconfig getifaddr en0 2>/dev/null || echo "localhost"):3001"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"

npm run dev