import React, { useState, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, BottomNavigation, BottomNavigationAction, Paper, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import BestTradeTable from '../components/BestTradeTable/BestTradeTable';
import ExecutionLogTable from '../components/ExecutionLogTable/ExecutionLogTable';
import CumulativeGainChart, { StatsBox } from '../components/CumulativeGainChart/CumulativeGainChart';
import HoldingsAllocationPanel from '../components/HoldingsAllocationPanel/HoldingsAllocationPanel';
import ConfigPanel from '../components/ConfigPanel/ConfigPanel';
import { TradeOpportunity } from '../../../shared/types/trade';
import { ExecutionLogEntry } from '../../../shared/types/executionLog';
import { TAOGainPoint } from '../../../shared/types/stats';
import { HoldingsAllocation } from '../../../shared/types/holdings';
import { ConfigSettings } from '../../../shared/types/config';
// import logo from '../../logo.png';

// Mock data for demonstration
const mockBestTrades: TradeOpportunity[] = [
  { id: '1', pair: 'SOL → BT', assetAmount: 'TAO (150 TAO)', bridge: 'LayerZero', eta: 420, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 15.2, executionStatus: 'Pending' },
  { id: '2', pair: 'BT → EVM', assetAmount: 'SNa (120 TAO)', bridge: 'LayerZero', eta: 350, slippage: '0.50 TAO', slippagePercent: '0.30', fee: '0.01 TAO + 0.001 LZ', gainTAO: 12.4, executionStatus: 'Executed' },
  { id: '3', pair: 'BT → SOL', assetAmount: 'SNa (100 TAO)', bridge: 'CCIP', eta: 460, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.02 TAO + 0.001 CC', gainTAO: 10.3, executionStatus: 'Pending' },
  { id: '4', pair: 'EVM → BT', assetAmount: 'TAO (100 TAO)', bridge: 'LayerZero', eta: 480, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 9.5, executionStatus: 'Pending' },
  { id: '5', pair: 'EVM → SOL', assetAmount: 'TAO (80 TAO)', bridge: 'CCIP', eta: 400, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.02 TAO + 0.001 CC', gainTAO: 8.7, executionStatus: 'Pending' },
  { id: '6', pair: 'SOL → EVM', assetAmount: 'TAO (200 TAO)', bridge: 'CCIP', eta: 390, slippage: '0.35 TAO', slippagePercent: '0.22', fee: '0.02 TAO + 0.001 CC', gainTAO: 18.1, executionStatus: 'Pending' },
  { id: '7', pair: 'BT → SOL', assetAmount: 'SNa (90 TAO)', bridge: 'LayerZero', eta: 410, slippage: '0.38 TAO', slippagePercent: '0.24', fee: '0.01 TAO + 0.001 LZ', gainTAO: 7.2, executionStatus: 'Pending' },
  { id: '8', pair: 'EVM → BT', assetAmount: 'TAO (110 TAO)', bridge: 'LayerZero', eta: 370, slippage: '0.41 TAO', slippagePercent: '0.27', fee: '0.01 TAO + 0.001 LZ', gainTAO: 11.6, executionStatus: 'Pending' },
  { id: '9', pair: 'SOL → EVM', assetAmount: 'TAO (130 TAO)', bridge: 'CCIP', eta: 430, slippage: '0.39 TAO', slippagePercent: '0.23', fee: '0.02 TAO + 0.001 CC', gainTAO: 13.9, executionStatus: 'Pending' },
  { id: '10', pair: 'BT → EVM', assetAmount: 'SNa (140 TAO)', bridge: 'LayerZero', eta: 360, slippage: '0.36 TAO', slippagePercent: '0.21', fee: '0.01 TAO + 0.001 LZ', gainTAO: 16.5, executionStatus: 'Pending' },
];

const mockExecutionLog: ExecutionLogEntry[] = [
  { id: '1', time: '15:52:14', pair: 'BT → EVM', assetAmount: 'SNa (120 TAO)', bridge: 'CCIP', eta: 400, execTime: 420, slippage: '0.50 TAO', slippagePercent: '0.30', fee: '0.02 TAO + 0.001 CC', gainTAO: 8.7, status: 'Done' },
  { id: '2', time: '14:58:43', pair: 'EVM → SOL', assetAmount: 'TAO (80 TAO)', bridge: 'LayerZero', eta: 350, execTime: 365, slippage: '0.30 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: -2.1, status: 'Failed' },
  { id: '3', time: '14:51:28', pair: 'SOL → BT', assetAmount: 'SNa (150 TAO)', bridge: 'LayerZero', eta: 420, execTime: 405, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 15.2, status: 'Done' },
  { id: '4', time: '13:45:00', pair: 'BT → SOL', assetAmount: 'TAO (100 TAO)', bridge: 'CCIP', eta: 460, execTime: 458, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.02 TAO + 0.001 CC', gainTAO: 10.3, status: 'Done' },
  { id: '5', time: '13:12:08', pair: 'EVM → BT', assetAmount: 'TAO (100 TAO)', bridge: 'LayerZero', eta: 480, execTime: 420, slippage: '0.40 TAO', slippagePercent: '0.25', fee: '0.01 TAO + 0.001 LZ', gainTAO: 9.5, status: 'Done' },
  { id: '6', time: '12:45:22', pair: 'SOL → EVM', assetAmount: 'TAO (200 TAO)', bridge: 'CCIP', eta: 390, execTime: 400, slippage: '0.35 TAO', slippagePercent: '0.22', fee: '0.02 TAO + 0.001 CC', gainTAO: 18.1, status: 'Done' },
  { id: '7', time: '12:12:10', pair: 'BT → SOL', assetAmount: 'SNa (90 TAO)', bridge: 'LayerZero', eta: 410, execTime: 415, slippage: '0.38 TAO', slippagePercent: '0.24', fee: '0.01 TAO + 0.001 LZ', gainTAO: -3.7, status: 'Failed' },
  { id: '8', time: '11:55:33', pair: 'EVM → BT', assetAmount: 'TAO (110 TAO)', bridge: 'LayerZero', eta: 370, execTime: 375, slippage: '0.41 TAO', slippagePercent: '0.27', fee: '0.01 TAO + 0.001 LZ', gainTAO: 11.6, status: 'Done' },
  { id: '9', time: '11:22:47', pair: 'SOL → EVM', assetAmount: 'TAO (130 TAO)', bridge: 'CCIP', eta: 430, execTime: 440, slippage: '0.39 TAO', slippagePercent: '0.23', fee: '0.02 TAO + 0.001 CC', gainTAO: 13.9, status: 'Done' },
  { id: '10', time: '10:58:19', pair: 'BT → EVM', assetAmount: 'SNa (140 TAO)', bridge: 'LayerZero', eta: 360, execTime: 370, slippage: '0.36 TAO', slippagePercent: '0.21', fee: '0.01 TAO + 0.001 LZ', gainTAO: -4.2, status: 'Failed' },
  { id: '11', time: '10:30:05', pair: 'EVM → SOL', assetAmount: 'TAO (95 TAO)', bridge: 'CCIP', eta: 405, execTime: 410, slippage: '0.33 TAO', slippagePercent: '0.20', fee: '0.02 TAO + 0.001 CC', gainTAO: 7.8, status: 'Done' },
  { id: '12', time: '10:01:44', pair: 'SOL → BT', assetAmount: 'SNa (160 TAO)', bridge: 'LayerZero', eta: 415, execTime: 420, slippage: '0.42 TAO', slippagePercent: '0.28', fee: '0.01 TAO + 0.001 LZ', gainTAO: 14.3, status: 'Done' },
  { id: '13', time: '09:45:12', pair: 'BT → SOL', assetAmount: 'TAO (120 TAO)', bridge: 'CCIP', eta: 395, execTime: 400, slippage: '0.37 TAO', slippagePercent: '0.22', fee: '0.02 TAO + 0.001 CC', gainTAO: 9.2, status: 'Done' },
  { id: '14', time: '09:20:33', pair: 'EVM → BT', assetAmount: 'TAO (105 TAO)', bridge: 'LayerZero', eta: 385, execTime: 390, slippage: '0.40 TAO', slippagePercent: '0.26', fee: '0.01 TAO + 0.001 LZ', gainTAO: 10.7, status: 'Done' },
  { id: '15', time: '08:59:59', pair: 'SOL → EVM', assetAmount: 'TAO (115 TAO)', bridge: 'CCIP', eta: 420, execTime: 425, slippage: '0.34 TAO', slippagePercent: '0.22', fee: '0.02 TAO + 0.001 CC', gainTAO: 12.5, status: 'Done' },
  { id: '16', time: '08:35:12', pair: 'BT → EVM', assetAmount: 'SNa (125 TAO)', bridge: 'LayerZero', eta: 380, execTime: 385, slippage: '0.35 TAO', slippagePercent: '0.21', fee: '0.01 TAO + 0.001 LZ', gainTAO: -1.8, status: 'Failed' },
  { id: '17', time: '08:12:45', pair: 'EVM → SOL', assetAmount: 'TAO (85 TAO)', bridge: 'CCIP', eta: 410, execTime: 415, slippage: '0.32 TAO', slippagePercent: '0.20', fee: '0.02 TAO + 0.001 CC', gainTAO: 6.9, status: 'Done' },
  { id: '18', time: '07:58:33', pair: 'SOL → BT', assetAmount: 'SNa (135 TAO)', bridge: 'LayerZero', eta: 425, execTime: 430, slippage: '0.41 TAO', slippagePercent: '0.26', fee: '0.01 TAO + 0.001 LZ', gainTAO: 13.7, status: 'Done' },
  { id: '19', time: '07:42:18', pair: 'BT → SOL', assetAmount: 'TAO (95 TAO)', bridge: 'CCIP', eta: 400, execTime: 405, slippage: '0.36 TAO', slippagePercent: '0.23', fee: '0.02 TAO + 0.001 CC', gainTAO: 8.4, status: 'Done' },
  { id: '20', time: '07:25:55', pair: 'EVM → BT', assetAmount: 'TAO (145 TAO)', bridge: 'LayerZero', eta: 375, execTime: 380, slippage: '0.38 TAO', slippagePercent: '0.24', fee: '0.01 TAO + 0.001 LZ', gainTAO: -2.3, status: 'Failed' },
  { id: '21', time: '07:08:42', pair: 'SOL → EVM', assetAmount: 'TAO (155 TAO)', bridge: 'CCIP', eta: 435, execTime: 440, slippage: '0.43 TAO', slippagePercent: '0.27', fee: '0.02 TAO + 0.001 CC', gainTAO: 16.8, status: 'Done' },
  { id: '22', time: '06:55:19', pair: 'BT → EVM', assetAmount: 'SNa (110 TAO)', bridge: 'LayerZero', eta: 365, execTime: 370, slippage: '0.34 TAO', slippagePercent: '0.21', fee: '0.01 TAO + 0.001 LZ', gainTAO: 9.1, status: 'Done' },
  { id: '23', time: '06:38:47', pair: 'EVM → SOL', assetAmount: 'TAO (75 TAO)', bridge: 'CCIP', eta: 395, execTime: 400, slippage: '0.31 TAO', slippagePercent: '0.19', fee: '0.02 TAO + 0.001 CC', gainTAO: 5.6, status: 'Done' },
  { id: '24', time: '06:22:14', pair: 'SOL → BT', assetAmount: 'SNa (170 TAO)', bridge: 'LayerZero', eta: 445, execTime: 450, slippage: '0.45 TAO', slippagePercent: '0.29', fee: '0.01 TAO + 0.001 LZ', gainTAO: 17.2, status: 'Done' },
  { id: '25', time: '06:05:33', pair: 'BT → SOL', assetAmount: 'TAO (105 TAO)', bridge: 'CCIP', eta: 385, execTime: 390, slippage: '0.35 TAO', slippagePercent: '0.22', fee: '0.02 TAO + 0.001 CC', gainTAO: 7.9, status: 'Done' },
];

const mockGainData: TAOGainPoint[] = (() => {
  const days = 180; // 6 months
  const pointsPerDay = 24; // hourly data
  let value = 100;
  const data: TAOGainPoint[] = [];
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < pointsPerDay; h++) {
      // Simulate realistic hourly change: -0.5 to +2.5 TAO, with a slight upward bias
      const change = (Math.random() - 0.2) * 1.5 + 0.5;
      value += change;
      // Add some volatility
      if (Math.random() < 0.05) value -= Math.random() * 3;
      if (value < 0) value = 0;
  const date = new Date();
      date.setDate(date.getDate() - (days - 1 - d));
      date.setHours(h, 0, 0, 0);
      data.push({
        timestamp: date.toISOString().slice(0, 13) + ':00:00', // YYYY-MM-DDTHH:00:00
        value: Math.round(value * 100) / 100,
      });
    }
  }
  return data;
})();

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

const RANGE_LABELS: Record<string, string> = {
  '1D': 'Daily Status',
  '1W': 'Weekly Status',
  '1M': 'Monthly Status',
  '3M': 'Quarterly Status',
  '6M': 'Half-Year Status',
  'YTD': 'Year-to-Date Status',
  '1Y': 'Yearly Status',
  '2Y': '2-Year Status',
  '5Y': '5-Year Status',
  '10Y': '10-Year Status',
  'ALL': 'All-Time Status',
};

const TABS = [
  { label: 'Home', icon: <HomeIcon /> },
  { label: 'Log', icon: <ListAltIcon /> },
  { label: 'Chart', icon: <ShowChartIcon /> },
  { label: 'Holdings', icon: <AccountBalanceWalletIcon /> },
  { label: 'Config', icon: <SettingsIcon /> },
];

const AppHeader = () => (
  <Box
    sx={{
      width: '100%',
      bgcolor: 'background.paper',
      py: { xs: 2, md: 3 },
      px: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderBottom: 1,
      borderColor: 'divider',
      mb: 2,
    }}
  >
    {/* Optional: Add your logo here */}
    {/* <img src="/logo.png" alt="TAO Magnet Logo" style={{ height: 40, marginBottom: 8 }} /> */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: 800,
        letterSpacing: 1,
        color: 'primary.main',
        mb: 0.5,
        textAlign: 'center',
      }}
    >
      TAO Magnet
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        color: 'text.secondary',
        fontWeight: 400,
        textAlign: 'center',
        maxWidth: 340,
      }}
    >
      Your Staking & Arbitrage Dashboard
    </Typography>
    <Divider sx={{ width: '100%', mt: 2 }} />
  </Box>
);

const Dashboard: React.FC = () => {
  const [allocation, setAllocation] = useState<HoldingsAllocation>(mockHoldings);
  const [config, setConfig] = useState<ConfigSettings>(mockConfig);
  const [bestTrades, setBestTrades] = useState<TradeOpportunity[]>(mockBestTrades);
  // Chart range state
  const [chartRange, setChartRange] = useState<string>('1D');
  const [tab, setTab] = useState(0);

  // Handler to update allocation percentages only
  const handleAllocate = (newAlloc: { bittensor: number; ethereum: number; solana: number }) => {
    setAllocation((prev: HoldingsAllocation) => ({
      ...prev,
      allocation: { ...newAlloc },
    }));
  };

  // Handler for executing a trade in manual mode
  const handleExecute = (opportunityId: string) => {
    setBestTrades((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, executionStatus: 'Executed' } : opp
      )
    );
  };

  // --- Chart data filtering logic (same as in CumulativeGainChart) ---
  const getFilteredData = (data: TAOGainPoint[], range: string | number) => {
    if (!data || data.length === 0) return [];
    const now = new Date();
    if (range === 'ALL' || range === 'all') return data;
    if (range === 'YTD' || range === 'ytd') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return data.filter(d => new Date(d.timestamp) >= yearStart);
    }
    const days = typeof range === 'string' ? parseInt(range) : range;
    const cutoff = new Date(now.getTime() - (Number(days) * 24 * 60 * 60 * 1000));
    return data.filter(d => new Date(d.timestamp) >= cutoff);
  };

  const filteredGainData = useMemo(() => getFilteredData(mockGainData, chartRange), [mockGainData, chartRange]);

  // --- StatsBox values based on filtered chart data ---
  const totalTAO = filteredGainData.length > 1
    ? Math.round(filteredGainData[filteredGainData.length - 1].value - filteredGainData[0].value)
    : 0;
  const trades = filteredGainData.length;
  const avgLatency = `${(Math.random() * 20 + 5).toFixed(1)} ms`;
  const successRate = filteredGainData.length > 1
    ? Math.round(
        (filteredGainData.filter((d, i) => i > 0 && d.value > filteredGainData[i - 1].value).length /
          (filteredGainData.length - 1)) * 100
      )
    : 0;
  const avgBridgeLatency = `${(Math.random() * 1.5 + 0.5).toFixed(2)} s`;
  const statsTitle = RANGE_LABELS[chartRange] || 'Status';

  return (
    <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader />
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          pt: 2,
        }}
      >
        {tab === 0 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', p: 2, mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Current Best Trade
              </Typography>
              <BestTradeTable
                opportunities={bestTrades}
                executionMode={config.executionMode}
                bridgePreference={config.bridgePreference}
                onExecute={handleExecute}
              />
            </CardContent>
          </Card>
        )}
        {tab === 1 && (
          <Card sx={{
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: '1px solid #222',
            p: 2,
            mb: 2,
            maxHeight: { xs: '60vh', sm: '70vh', md: '75vh' },
            display: 'flex',
            flexDirection: 'column',
          }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Execution Log
              </Typography>
                            <Box sx={{
                flex: 1,
                minHeight: 0,
                maxHeight: '400px',
                overflow: 'auto',
                border: '1px solid #333',
                borderRadius: 1,
                bgcolor: 'transparent',
                width: '100%'
              }}>
              <ExecutionLogTable log={mockExecutionLog} />
              </Box>
            </CardContent>
          </Card>
        )}
        {tab === 2 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', p: 2, mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                Cumulative TAO Gain
              </Typography>
              <CumulativeGainChart data={filteredGainData} range={chartRange} setRange={setChartRange} />
              <StatsBox
                title={statsTitle}
                totalTAO={totalTAO}
                trades={trades}
                avgLatency={avgLatency}
                successRate={successRate}
                avgBridgeLatency={avgBridgeLatency}
              />
            </CardContent>
          </Card>
        )}
        {tab === 3 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', p: 2, mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <HoldingsAllocationPanel allocation={allocation} onAllocate={handleAllocate} />
            </CardContent>
          </Card>
        )}
        {tab === 4 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #222', p: 2, mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <ConfigPanel config={config} onChange={setConfig} />
            </CardContent>
          </Card>
        )}
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={3}>
        <BottomNavigation
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          showLabels
        >
          {TABS.map((tabItem, idx) => (
            <BottomNavigationAction key={tabItem.label} label={tabItem.label} icon={tabItem.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Dashboard; 