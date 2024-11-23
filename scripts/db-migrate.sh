#!/bin/bash

# Usage: ./db-migrate.sh [staging|production] [up|down|reset|status]

# Default values
ENVIRONMENT=${1:-staging}
ACTION=${2:-up}

# Validate environment argument
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Validate action argument
if [ "$ACTION" != "up" ] && [ "$ACTION" != "down" ] && [ "$ACTION" != "reset" ] && [ "$ACTION" != "status" ]; then
    echo "Invalid action. Use 'up', 'down', 'reset', or 'status'"
    exit 1
fi

# Load environment variables
source .env.$ENVIRONMENT

echo "Running database migration for $ENVIRONMENT environment..."

case $ACTION in
    up)
        echo "Applying migrations..."
        npx prisma migrate deploy
        ;;
    down)
        echo "Rolling back last migration..."
        npx prisma migrate reset --force
        ;;
    reset)
        echo "Resetting database..."
        npx prisma migrate reset --force
        npx prisma db push --force-reset
        ;;
    status)
        echo "Checking migration status..."
        npx prisma migrate status
        ;;
esac

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Migration action '$ACTION' completed for $ENVIRONMENT environment!"
