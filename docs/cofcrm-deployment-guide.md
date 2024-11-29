# COFCRM Deployment Guide

This guide outlines the steps to deploy COFCRM alongside the existing VCC platform.

## 0. Development Code Preparation

### Project Structure Setup
```bash
mkdir cofcrm
cd cofcrm

# Initialize new React project with Vite
npm create vite@latest . -- --template react-ts

# Install necessary dependencies
npm install \
  @tanstack/react-query \
  react-router-dom \
  @prisma/client \
  express \
  pm2
  
# Install dev dependencies
npm install -D \
  @types/express \
  @types/node \
  prisma \
  typescript \
  ts-node \
  tsc-alias
```

### Configure TypeScript
Create `tsconfig.server.json` for backend:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist/server",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/server/**/*"],
  "exclude": ["node_modules"]
}
```

### Setup Build Scripts
Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:frontend && npm run build:server && npm run postbuild",
    "build:frontend": "vite build",
    "build:server": "tsc -p tsconfig.server.json && tsc-alias -p tsconfig.server.json",
    "postbuild": "node scripts/postbuild.js",
    "preview": "vite preview"
  }
}
```

Create `scripts/postbuild.js`:
```javascript
const fs = require('fs');
const path = require('path');

// Copy public directory to dist
fs.cpSync('public', 'dist/public', { recursive: true });
console.log('Successfully copied public directory to dist');

// Generate Prisma client
const { execSync } = require('child_process');
execSync('npx prisma generate', { stdio: 'inherit' });
```

## 1. Nginx Configuration

Create a new nginx config file at `/etc/nginx/sites-available/cofcrm.conf`:

```nginx
server {
    listen 80;
    server_name cofcrm.myinvoices.today;
    root /var/www/cofcrm;
    index index.html;

    # API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /assets/ {
        alias /var/www/cofcrm/assets/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

## 2. PM2 Configuration

Create `ecosystem.config.cjs` in the COFCRM project:

```javascript
module.exports = {
  apps: [{
    name: 'cofcrm',
    script: './dist/server/server.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log'
  }]
};
```

## 3. Vite Configuration

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
```

## 4. Production Build and Deployment

```bash
# Clean previous builds
rm -rf dist/

# Install dependencies
npm ci

# Build the application
npm run build

# Create web root
sudo mkdir -p /var/www/cofcrm

# Copy build files
sudo cp -r dist/* /var/www/cofcrm/

# Set permissions
sudo chown -R www-data:www-data /var/www/cofcrm
sudo chmod -R 755 /var/www/cofcrm

# Enable nginx config
sudo ln -s /etc/nginx/sites-available/cofcrm.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start with PM2
pm2 delete cofcrm # if exists
pm2 start ecosystem.config.cjs
pm2 save
```

## 5. DNS Configuration

Add an A record for `cofcrm.myinvoices.today` pointing to your server IP.

## 6. Verification

- `vcc.myinvoices.today` should serve VCC app (port 3000 internally)
- `cofcrm.myinvoices.today` should serve COFCRM app (port 4000 internally)
- Both apps will be accessible on port 80 externally
- PM2 will manage both apps independently
- Nginx will route traffic based on domain name

## Port Usage

- VCC: Uses ports 3000-3005
- COFCRM: Uses port 4000

## Notes

- Make sure to adjust file paths and configurations according to your specific setup
- Both apps will run independently with their own ports and PM2 processes
- Nginx handles routing based on domain names
- All external traffic comes through port 80, internal routing uses different ports
- The development code is built and optimized before deployment
- PM2 ensures the Node.js server stays running and handles clustering
- Nginx serves static files and proxies API requests to the Node.js server
