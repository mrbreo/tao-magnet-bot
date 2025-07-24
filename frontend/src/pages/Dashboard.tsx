import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import BestTradeTable from '../components/BestTradeTable/BestTradeTable';
import ExecutionLogTable from '../components/ExecutionLogTable/ExecutionLogTable';
import CumulativeGainChart, { StatsBox } from '../components/CumulativeGainChart/CumulativeGainChart';
import HoldingsAllocationPanel from '../components/HoldingsAllocationPanel/HoldingsAllocationPanel';
import ConfigPanel from '../components/ConfigPanel/ConfigPanel';
import { TradeOpportunity, ExecutionMode, BridgePreference } from '../../../shared/types/trade';
import { ExecutionLogEntry } from '../../../shared/types/executionLog';
import { TAOGainPoint } from '../../../shared/types/stats';
import { HoldingsAllocation } from '../../../shared/types/holdings';
import { ConfigSettings } from '../../../shared/types/config';

// Mock data for demonstration
const mockBestTrades: TradeOpportunity[] = [
  { id: '1', pair: 'SOL → BT', assetAmount: 'TAO (150 TAO)', bridge: 'LayerZero', eta: 420, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 15.2, executionStatus: 'Pending' },
  { id: '2', pair: 'BT → EVM', assetAmount: 'SNa (120 TAO)', bridge: 'LayerZero', eta: 350, slippage: '0.50 TAO', slippagePercent: '0.30', fee: '0.01 TAO + 0.001 LZ', gainTAO: 12.4, executionStatus: 'Executed' },
  { id: '3', pair: 'BT → SOL', assetAmount: 'SNa (100 TAO)', bridge: 'CCIP', eta: 460, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.02 TAO + 0.001 CC', gainTAO: 10.3, executionStatus: 'Pending' },
  { id: '4', pair: 'EVM → BT', assetAmount: 'TAO (100 TAO)', bridge: 'LayerZero', eta: 480, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 9.5, executionStatus: 'Pending' },
  { id: '5', pair: 'EVM → SOL', assetAmount: 'TAO (80 TAO)', bridge: 'CCIP', eta: 400, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.02 TAO + 0.001 CC', gainTAO: -8.7, executionStatus: 'Pending' },
];

const mockExecutionLog: ExecutionLogEntry[] = [
  { id: '1', time: '15:52:14', pair: 'BT → EVM', assetAmount: 'SNa (120 TAO)', bridge: 'CCIP', eta: 400, execTime: 420, slippage: '0.50 TAO', slippagePercent: '0.30', fee: '0.02 TAO + 0.001 CC', gainTAO: -8.7, status: 'done' },
  { id: '2', time: '14:58:43', pair: 'EVM → SOL', assetAmount: 'TAO (80 TAO)', bridge: 'LayerZero', eta: 350, execTime: 365, slippage: '0.30 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: -2.1, status: 'failed' },
  { id: '3', time: '14:51:28', pair: 'SOL → BT', assetAmount: 'SNa (150 TAO)', bridge: 'LayerZero', eta: 420, execTime: 405, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 15.2, status: 'done' },
  { id: '4', time: '13:45:00', pair: 'BT → SOL', assetAmount: 'TAO (100 TAO)', bridge: 'CCIP', eta: 460, execTime: 458, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.02 TAO + 0.001 CC', gainTAO: 10.3, status: 'done' },
  { id: '5', time: '13:12:08', pair: 'EVM → BT', assetAmount: 'TAO (100 TAO)', bridge: 'LayerZero', eta: 480, execTime: 420, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 9.5, status: 'done' },
];

const mockGainData: TAOGainPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i)); // Last 30 days
  return { 
    timestamp: date.toISOString().split('T')[0], // YYYY-MM-DD format
    value: 100 + i * 5 + Math.random() * 10 
  };
});

const mockHoldings: HoldingsAllocation = {
  taoBalance: 3000,
  bittensor: 900,
  ethereum: 900,
  solana: 1200,
  allocation: { bittensor: 30, ethereum: 30, solana: 40 },
};

const mockConfig: ConfigSettings = {
  minGainThreshold: 10,
  opportunityPriority: { timeWeight: 50, gainWeight: 50 },
  bridgePreference: 'best',
  executionMode: 'auto',
};

const Dashboard: React.FC = () => {
  const [allocation, setAllocation] = useState<HoldingsAllocation>(mockHoldings);
  const [config, setConfig] = useState<ConfigSettings>(mockConfig);

  // Handler to update allocation percentages only
  const handleAllocate = (newAlloc: { bittensor: number; ethereum: number; solana: number }) => {
    setAllocation((prev: HoldingsAllocation) => ({
      ...prev,
      allocation: { ...newAlloc },
    }));
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
        TAO Magnet
      </Typography>
      {/* Main Grid */}
      <Grid container spacing={5}>
        {/* Best Trade Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', p: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Current Best Trade
              </Typography>
              <BestTradeTable opportunities={mockBestTrades} executionMode={config.executionMode} bridgePreference={config.bridgePreference} />
            </CardContent>
          </Card>
        </Grid>
        {/* Execution Log */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', p: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Execution Log
              </Typography>
              <ExecutionLogTable log={mockExecutionLog} />
            </CardContent>
          </Card>
        </Grid>
        {/* Bottom Panels: Chart, Holdings, Config */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Cumulative TAO Gain
              </Typography>
              <CumulativeGainChart data={mockGainData} />
              <StatsBox />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <HoldingsAllocationPanel allocation={allocation} onAllocate={handleAllocate} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <ConfigPanel config={config} onChange={setConfig} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 