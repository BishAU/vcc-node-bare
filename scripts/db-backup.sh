#!/bin/bash

# Usage: ./db-backup.sh [staging|production]

# Default to production if no environment specified
ENVIRONMENT=${1:-production}

# Validate environment argument
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Load environment variables
source .env.$ENVIRONMENT

# Create backup directory if it doesn't exist
BACKUP_DIR="backups/$ENVIRONMENT/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR

# Create backup filename with timestamp
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# Extract database connection details from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\(.*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\(.*\)?.*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\(.*\):.*/\1/p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p')

# Create backup
echo "Creating backup for $ENVIRONMENT database..."
PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    -F c \
    -b \
    -v \
    -f $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_FILE"
    
    # Compress backup
    gzip $BACKUP_FILE
    echo "Backup compressed: $BACKUP_FILE.gz"
    
    # Clean up old backups (keep last 7 days)
    find backups/$ENVIRONMENT -type f -name "*.gz" -mtime +7 -delete
    echo "Cleaned up backups older than 7 days"
else
    echo "Backup failed!"
    exit 1
fi

# If in production, upload to secure storage
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Uploading production backup to secure storage..."
    # Add your secure storage upload command here
    # Example: aws s3 cp $BACKUP_FILE.gz s3://your-bucket/backups/
fi

echo "Backup process completed!"
