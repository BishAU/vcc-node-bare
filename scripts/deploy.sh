#!/bin/bash

# Usage: ./deploy.sh [staging|production]

# Default to staging if no environment specified
ENVIRONMENT=${1:-staging}

# Validate environment argument
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

echo "Deploying to $ENVIRONMENT environment..."

# Copy appropriate Coolify config
cp "coolify.$ENVIRONMENT.json" coolify.json

# Build Docker image with environment-specific configuration
docker build \
    --build-arg NODE_ENV=$ENVIRONMENT \
    -t vcc-abs:$ENVIRONMENT .

# Push to Coolify registry (update with your registry details)
docker tag vcc-abs:$ENVIRONMENT registry.coolify.io/vcc-abs:$ENVIRONMENT
docker push registry.coolify.io/vcc-abs:$ENVIRONMENT

echo "Deployment to $ENVIRONMENT completed!"
