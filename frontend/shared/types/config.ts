export interface ConfigSettings {
  minGainThreshold: number;
  opportunityPriority: {
    timeWeight: number;
    gainWeight: number;
  };
  bridgePreference: string;
  executionMode: string;
} 