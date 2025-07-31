export interface ExecutionLogEntry {
  id: string;
  time: string; // e.g. '15:52:14'
  pair: string;
  assetAmount: string;
  bridge: string;
  eta: number;
  execTime: number;
  slippage: string;
  slippagePercent: string;
  fee: string;
  gainTAO: number;
  status: 'Done' | 'Failed';
} 