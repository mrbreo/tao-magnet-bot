# TAO Magnet - Cross-Chain Arbitrage Bot

## Overview
TAO Magnet is a sophisticated cross-chain arbitrage bot designed to capitalize on price differences of TAO and Bittensor subnet alpha tokens across multiple blockchain ecosystems (Bittensor, Ethereum, Solana).

## Core Features
- **Cross-Chain Price Monitoring**: Real-time price tracking across Bittensor, Ethereum, and Solana
- **Arbitrage Detection**: Automated identification of profitable trading opportunities
- **Smart Execution**: Optimized trade execution considering fees, gas, slippage, and speed
- **TAO-Centric Strategy**: All trades result in TAO holdings
- **Web Dashboard**: Real-time monitoring and control interface

## Supported Tokens
- **TAO**: Primary token for all arbitrage operations
- **Subnet Alpha Tokens**: Various Bittensor subnet tokens (SN100, SN101, etc.)

## Supported Chains
- **Bittensor Network**: Native TAO and subnet token ecosystem
- **Ethereum**: Via LayerZero and Chainlink CCIP bridges
- **Solana**: Via LayerZero and Chainlink CCIP bridges

## Architecture

### Backend Components
- **Price Aggregator**: Fetches real-time prices from multiple sources
- **Arbitrage Engine**: Calculates profitable opportunities
- **Execution Engine**: Handles cross-chain transactions
- **Risk Manager**: Monitors positions and manages risk
- **Bridge Manager**: Handles cross-chain transfers

### Frontend Components
- **Dashboard**: Real-time monitoring interface
- **Configuration Panel**: Bot settings and parameters
- **Analytics**: Performance metrics and trade history
- **Alert System**: Notifications for opportunities and issues

## Project Structure
```
tao-magnet-bot/
├── backend/
│   ├── src/
│   │   ├── core/
│   │   ├── arbitrage/
│   │   ├── execution/
│   │   ├── bridges/
│   │   ├── price/
│   │   └── risk/
│   ├── config/
│   ├── tests/
│   └── docs/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── tests/
├── shared/
│   ├── types/
│   ├── constants/
│   └── utils/
└── deployment/
    ├── docker/
    ├── k8s/
    └── scripts/
```

## Technology Stack
- **Backend**: Node.js/TypeScript, Express.js
- **Frontend**: React/TypeScript, Material-UI
- **Database**: PostgreSQL, Redis
- **Blockchain**: Web3.js, ethers.js, Solana Web3
- **Monitoring**: Prometheus, Grafana
- **Deployment**: Docker, Kubernetes

## Getting Started
See individual component READMEs for detailed setup instructions. 