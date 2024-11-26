#!/bin/bash

echo "=== Checking Traefik Status ==="
docker ps | grep traefik
echo -e "\n=== Traefik Logs ==="
docker logs --tail 50 coolify-proxy

echo -e "\n=== Checking Application Status ==="
docker ps | grep vcc-abs-staging
APP_CONTAINER=$(docker ps -q --filter "name=vcc-abs-staging")
if [ ! -z "$APP_CONTAINER" ]; then
    echo -e "\n=== Application Logs ==="
    docker logs --tail 50 $APP_CONTAINER
    
    echo -e "\n=== Container Network Info ==="
    docker inspect $APP_CONTAINER -f '{{json .NetworkSettings.Networks}}' | jq
    
    echo -e "\n=== Testing Internal Health Check ==="
    docker exec $APP_CONTAINER curl -v localhost:3000/api/health
fi

echo -e "\n=== Checking Network Configuration ==="
docker network ls | grep coolify
docker network inspect coolify

echo -e "\n=== Checking SSL Certificate ==="
docker exec coolify-proxy cat /traefik/acme.json

echo -e "\n=== Checking Port Bindings ==="
netstat -tlpn | grep -E ':80|:443|:3000'

echo -e "\n=== System Resources ==="
df -h
free -m
top -b -n 1 | head -n 20
