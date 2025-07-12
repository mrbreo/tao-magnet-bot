export interface ConfigSettings {
  minGainThreshold: number;
  opportunityPriority: {
    timeWeight: number; // 0-100
    gainWeight: number; // 0-100
  };
  bridgePreference: 'best' | 'layerzero' | 'ccip';
  executionMode: 'auto' | 'manual';
} 