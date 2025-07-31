#!/bin/bash

# TAO Magnet Frontend Production Deployment Script
set -e

echo "🚀 Starting TAO Magnet Frontend Production Deployment..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Step 2: Build the application
echo "🔨 Building application..."
npm run build

# Step 3: Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing nginx..."
    apt update && apt install -y nginx
fi

# Step 4: Copy built files to nginx directory
echo "📁 Copying files to nginx..."
cp -r dist/* /var/www/html/

# Step 5: Copy nginx configuration
echo "⚙️ Configuring nginx..."
cp nginx.conf /etc/nginx/sites-available/tao-magnet
ln -sf /etc/nginx/sites-available/tao-magnet /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Step 6: Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

# Step 7: Restart nginx
echo "🔄 Restarting nginx..."
systemctl restart nginx

# Step 8: Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 80
ufw allow 443

# Step 9: Enable nginx on boot
echo "🔧 Enabling nginx on boot..."
systemctl enable nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now available at:"
echo "   http://$(curl -s ifconfig.me)"
echo ""
echo "📋 Next steps:"
echo "   1. Set up SSL certificate with Let's Encrypt"
echo "   2. Configure your domain name"
echo "   3. Set up monitoring and logging" 