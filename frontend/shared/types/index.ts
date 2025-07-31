export * from './trade';
export * from './executionLog';
export * from './stats';
export * from './holdings';
export * from './config';

export interface ArbitrageOpportunity {
  id: string;
  pair: string;
  assetAmount: string;
  bridge: string;
  eta: number;
  slippage: string;
  slippagePercent: string;
  fee: string;
  gainTAO: number;
  executionStatus: string;
}

export interface BotConfiguration {
  minGainThreshold: number;
  opportunityPriority: {
    timeWeight: number;
    gainWeight: number;
  };
  bridgePreference: string;
  executionMode: string;
}

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
} 