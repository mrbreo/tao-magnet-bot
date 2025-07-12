# TAO Magnet Bot - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the TAO Magnet cross-chain arbitrage bot for TAO and Bittensor subnet alpha tokens.

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 50GB SSD
- **CPU**: 4+ cores recommended
- **Network**: Stable internet connection

### Software Requirements
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18+ (for development)
- **Git**: Latest version

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tao-magnet-bot
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

### 3. Configure Environment Variables

#### Required Variables
```bash
# API Keys (Required)
BITTENSOR_API_KEY=your_bittensor_api_key
ETHEREUM_API_KEY=your_ethereum_api_key
SOLANA_API_KEY=your_solana_api_key
COINGECKO_API_KEY=your_coingecko_api_key

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/tao_magnet
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=your_secure_jwt_secret_here
ENCRYPTION_KEY=your_secure_encryption_key_here
```

#### Optional Variables
```bash
# Telegram Notifications
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
```

## Service Architecture

### Core Services
1. **Backend API** (Port 3001)
   - Arbitrage engine
   - Price aggregation
   - Trade execution
   - Risk management

2. **Frontend Dashboard** (Port 3000)
   - Real-time monitoring
   - Configuration panel
   - Analytics dashboard

3. **PostgreSQL Database** (Port 5432)
   - Trade history
   - Configuration storage
   - Analytics data

4. **Redis Cache** (Port 6379)
   - Price caching
   - Session storage
   - Real-time data

### Monitoring Services
5. **Prometheus** (Port 9090)
   - Metrics collection
   - Performance monitoring

6. **Grafana** (Port 3002)
   - Dashboard visualization
   - Alert management

7. **Nginx** (Port 80/443)
   - Reverse proxy
   - SSL termination
   - Load balancing

## Configuration

### Bot Configuration
```bash
# Minimum profit threshold (USD)
MIN_PROFIT_THRESHOLD=10

# Maximum slippage tolerance (%)
MAX_SLIPPAGE=0.5

# Gas price multiplier for faster execution
GAS_PRICE_MULTIPLIER=1.1

# Maximum concurrent trades
MAX_CONCURRENT_TRADES=3

# Risk tolerance (0-1)
RISK_TOLERANCE=0.7
```

### Trading Hours
```bash
# 24-hour format
TRADING_HOURS_START=00:00
TRADING_HOURS_END=23:59
```

## API Endpoints

### Arbitrage Endpoints
- `GET /api/v1/arbitrage/opportunities` - Get current opportunities
- `POST /api/v1/arbitrage/execute` - Execute arbitrage trade
- `GET /api/v1/arbitrage/history` - Get trade history

### Price Endpoints
- `GET /api/v1/price/current` - Get current prices
- `GET /api/v1/price/history` - Get price history

### Configuration Endpoints
- `GET /api/v1/config` - Get bot configuration
- `PUT /api/v1/config` - Update bot configuration

### Analytics Endpoints
- `GET /api/v1/analytics/overview` - Get analytics overview
- `GET /api/v1/analytics/profit` - Get profit analytics

## Monitoring & Alerts

### Prometheus Metrics
- `arbitrage_opportunities_total`
- `arbitrage_trades_executed`
- `arbitrage_profit_total`
- `price_update_duration`
- `execution_success_rate`

### Grafana Dashboards
1. **Overview Dashboard**
   - Real-time profit tracking
   - Trade success rate
   - Active opportunities

2. **Performance Dashboard**
   - Execution times
   - Gas costs
   - Slippage analysis

3. **Risk Dashboard**
   - Risk metrics
   - Loss tracking
   - Volatility analysis

### Alert Rules
```yaml
# High loss alert
- alert: HighLoss
  expr: arbitrage_loss_total > 100
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High arbitrage loss detected"

# Bot offline alert
- alert: BotOffline
  expr: up{job="tao-magnet-backend"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "TAO Magnet bot is offline"
```

## Security Considerations

### API Security
- Rate limiting enabled
- JWT authentication
- CORS configuration
- Input validation

### Database Security
- Encrypted connections
- Regular backups
- Access control
- Audit logging

### Network Security
- Firewall configuration
- SSL/TLS encryption
- VPN access (recommended)
- DDoS protection

## Backup & Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres tao_magnet > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres tao_magnet < backup.sql
```

### Configuration Backup
```bash
# Backup configuration
cp .env .env.backup
cp -r config/ config.backup/
```

### Disaster Recovery
1. Stop all services
2. Restore database backup
3. Restore configuration files
4. Restart services
5. Verify functionality

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
docker-compose logs service_name

# Check resource usage
docker stats

# Restart service
docker-compose restart service_name
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# Reset database
docker-compose down
docker volume rm tao-magnet-bot_postgres_data
docker-compose up -d
```

#### Price Data Issues
```bash
# Check API keys
docker-compose exec backend env | grep API_KEY

# Test price endpoints
curl http://localhost:3001/api/v1/price/current
```

### Performance Optimization

#### Resource Limits
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
```

#### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_opportunities_timestamp ON opportunities(timestamp);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_prices_token_chain ON prices(token, chain);
```

## Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Load balancer configuration
# Add nginx load balancer configuration
```

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Add caching layers
- Implement connection pooling

## Maintenance

### Regular Maintenance Tasks
1. **Daily**
   - Check service health
   - Review error logs
   - Monitor profit/loss

2. **Weekly**
   - Database maintenance
   - Log rotation
   - Configuration review

3. **Monthly**
   - Security updates
   - Performance review
   - Backup verification

### Update Process
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verify deployment
docker-compose ps
curl http://localhost:3001/health
```

## Support

### Logs Location
- Application logs: `./logs/`
- Docker logs: `docker-compose logs`
- System logs: `/var/log/`

### Contact Information
- **Technical Support**: [support@taomagnet.com]
- **Documentation**: [docs.taomagnet.com]
- **GitHub Issues**: [github.com/taomagnet/issues]

### Emergency Procedures
1. **Service Down**: Check logs and restart
2. **Data Loss**: Restore from backup
3. **Security Breach**: Isolate and investigate
4. **Performance Issues**: Scale resources

## License
This project is licensed under the MIT License. See LICENSE file for details. 