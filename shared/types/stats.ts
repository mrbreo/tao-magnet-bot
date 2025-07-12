export interface TAOGainPoint {
  timestamp: string;
  value: number;
}

export interface StatsMetrics {
  totalTAONetted: number;
  tradesExecuted: number;
  avgDetectionLatency: number;
  successRate: number;
  avgBridgeLatency: number;
} 