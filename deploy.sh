#!/bin/bash

# Mountain Taxes Deployment Script
# This script builds the TypeScript application and deploys it using CDK

set -e  # Exit on any error

echo "🏔️  Mountain Taxes Deployment"
echo "========================================"

# Check if domain name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: ./deploy.sh <domain-name>"
    echo "Example: ./deploy.sh taxes.anthonyjamespearson.com"
    exit 1
fi

DOMAIN_NAME=$1

echo "📦 Installing dependencies..."
cd website
npm ci

echo "🔍 Running type checks..."
npm run type-check

echo "🧹 Skipping linter (optional)..."
# npm run lint

echo "🧪 Running tests..."
npm run test

echo "🏗️  Building production bundle..."
npm run build:prod

echo "📊 Build complete! Checking output..."
if [ ! -d "dist" ]; then
    echo "❌ Error: Build output directory 'dist' not found"
    exit 1
fi

echo "✅ Build output verified"
cd ..

echo "🚀 Deploying to AWS..."
cd infrastructure
cdk deploy --context name=$DOMAIN_NAME --require-approval never

echo "🎉 Deployment complete!"
echo "🌐 Your application should be available at: https://$DOMAIN_NAME"