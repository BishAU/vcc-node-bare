#!/bin/bash

# Function to enable a site configuration
enable_site() {
    site_name=$1
    if [ ! -f "/etc/nginx/sites-available/$site_name" ]; then
        echo "Error: Configuration file /etc/nginx/sites-available/$site_name does not exist"
        exit 1
    fi
    
    if [ -L "/etc/nginx/sites-enabled/$site_name" ]; then
        echo "Site $site_name is already enabled"
    else
        sudo ln -s "/etc/nginx/sites-available/$site_name" "/etc/nginx/sites-enabled/"
        echo "Site $site_name has been enabled"
    fi
}

# Function to disable a site configuration
disable_site() {
    site_name=$1
    if [ -L "/etc/nginx/sites-enabled/$site_name" ]; then
        sudo rm "/etc/nginx/sites-enabled/$site_name"
        echo "Site $site_name has been disabled"
    else
        echo "Site $site_name is not enabled"
    fi
}

# Function to test nginx configuration
test_config() {
    echo "Testing Nginx configuration..."
    sudo nginx -t
}

# Function to reload nginx
reload_nginx() {
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
}

# Main script
case "$1" in
    enable)
        if [ -z "$2" ]; then
            echo "Usage: $0 enable <site-config-name>"
            exit 1
        fi
        enable_site "$2"
        test_config
        if [ $? -eq 0 ]; then
            reload_nginx
        fi
        ;;
    disable)
        if [ -z "$2" ]; then
            echo "Usage: $0 disable <site-config-name>"
            exit 1
        fi
        disable_site "$2"
        test_config
        if [ $? -eq 0 ]; then
            reload_nginx
        fi
        ;;
    test)
        test_config
        ;;
    reload)
        test_config
        if [ $? -eq 0 ]; then
            reload_nginx
        fi
        ;;
    *)
        echo "Usage: $0 {enable|disable|test|reload} [site-config-name]"
        echo "Examples:"
        echo "  $0 enable vcc-platform.conf"
        echo "  $0 disable vcc-platform.conf"
        echo "  $0 test"
        echo "  $0 reload"
        exit 1
        ;;
esac

exit 0
