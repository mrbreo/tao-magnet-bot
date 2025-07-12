export type ExecutionMode = 'auto' | 'manual';
export type BridgePreference = 'best' | 'layerzero' | 'ccip';

export interface TradeOpportunity {
  id: string;
  pair: string; // e.g. 'SOL - BT'
  assetAmount: string; // e.g. 'TAO (150 TAO)'
  bridge: string; // e.g. 'LayerZero'
  eta: number; // ms
  slippage: string; // e.g. '0.40 TAO'
  slippagePercent: string; // e.g. '0.25'
  fee: string; // e.g. '0.01 TAO + 0.001 LZ'
  gainTAO: number;
  executionStatus: 'Pending' | 'Executed';
} 