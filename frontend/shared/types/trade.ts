export interface TradeOpportunity {
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

export type ExecutionMode = 'auto' | 'manual';
export type BridgePreference = 'best' | 'layerzero' | 'ccip'; 