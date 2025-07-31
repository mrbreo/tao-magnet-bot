export interface ExecutionLogEntry {
  id: string;
  time: string;
  pair: string;
  assetAmount: string;
  bridge: string;
  eta: number;
  execTime: number;
  slippage: string;
  slippagePercent: string;
  fee: string;
  gainTAO: number;
  status: string;
} 