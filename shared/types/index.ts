// Core types for TAO Magnet arbitrage bot

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chain: string;
  price: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface ChainInfo {
  id: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    symbol: string;
    name: string;
    decimals: number;
  };
  gasPrice: number;
  isActive: boolean;
}

export interface ArbitrageOpportunity {
  id: string;
  token: string;
  sourceChain: string;
  targetChain: string;
  sourcePrice: number;
  targetPrice: number;
  priceDifference: number;
  percentageDifference: number;
  estimatedProfit: number;
  estimatedFees: number;
  riskScore: number;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';
  actualProfit?: number;
  executionTime?: number;
  error?: string;
}

export interface TradeDecision {
  opportunityId: string;
  action: 'execute' | 'skip' | 'wait';
  reason: string;
  confidence: number;
  estimatedExecutionTime: number;
  riskFactors: string[];
}

export interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  actualProfit?: number;
  executionTime?: number;
  gasUsed?: number;
  fees?: number;
  error?: string;
  details?: {
    sourceChain: string;
    targetChain: string;
    amount: number;
    bridgeUsed: string;
  };
}

export interface PriceData {
  token: string;
  chain: string;
  price: number;
  volume24h: number;
  timestamp: Date;
  source: string;
  confidence: number;
}

export interface BridgeInfo {
  id: string;
  name: string;
  sourceChain: string;
  targetChain: string;
  supportedTokens: string[];
  fees: {
    fixed: number;
    percentage: number;
  };
  estimatedTime: number;
  isActive: boolean;
}

export interface RiskAssessment {
  opportunityId: string;
  overallRisk: number;
  factors: {
    liquidity: number;
    volatility: number;
    bridgeRisk: number;
    gasPriceRisk: number;
    slippageRisk: number;
  };
  recommendations: string[];
}

export interface BotConfiguration {
  minProfitThreshold: number;
  maxSlippage: number;
  gasPriceMultiplier: number;
  maxConcurrentTrades: number;
  riskTolerance: number;
  enabledChains: string[];
  enabledTokens: string[];
  tradingHours: {
    start: string;
    end: string;
  };
}

export interface AnalyticsData {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: number;
  averageProfit: number;
  bestTrade: {
    profit: number;
    date: Date;
    opportunity: ArbitrageOpportunity;
  };
  worstTrade: {
    loss: number;
    date: Date;
    opportunity: ArbitrageOpportunity;
  };
  profitByToken: Record<string, number>;
  profitByChain: Record<string, number>;
  monthlyProfit: Record<string, number>;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
}

export interface WalletBalance {
  chain: string;
  token: string;
  balance: number;
  valueUSD: number;
  lastUpdated: Date;
}

export interface NetworkStatus {
  chain: string;
  isConnected: boolean;
  blockHeight: number;
  gasPrice: number;
  lastUpdate: Date;
  latency: number;
}

// Enums
export enum TradeStatus {
  PENDING = 'pending',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum ChainType {
  BITTENSOR = 'bittensor',
  ETHEREUM = 'ethereum',
  SOLANA = 'solana'
}

export enum TokenType {
  TAO = 'TAO',
  ALPHA = 'ALPHA'
}

export enum AlertType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
} 