#!/bin/bash

# Mountain Taxes Local Build Script
# This script builds the TypeScript application for local testing

set -e  # Exit on any error

echo "🏔️  Mountain Taxes Local Build"
echo "========================================"

echo "📦 Installing dependencies..."
cd website
npm ci

echo "🔍 Running type checks..."
npm run type-check

echo "🧹 Skipping linter (optional)..."
# npm run lint

echo "🧪 Running tests..."
npm run test

echo "🏗️  Building development bundle..."
npm run build

echo "📊 Build complete!"
echo "✅ Output available in website/dist/"
echo "🌐 To preview locally, run: npm run preview"

cd ..