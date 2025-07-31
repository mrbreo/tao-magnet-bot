import React from 'react';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TAOGainPoint } from '../../../../shared/types/stats';

interface CumulativeGainChartProps {
  data: TAOGainPoint[];
  range: string;
  setRange: (range: string) => void;
}

const RANGE_OPTIONS = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: 'YTD', days: 'ytd' },
  { label: '1Y', days: 365 },
  { label: '2Y', days: 730 },
  { label: '5Y', days: 1825 },
  { label: '10Y', days: 3650 },
  { label: 'ALL', days: 'all' },
];

const CumulativeGainChart: React.FC<CumulativeGainChartProps> = ({ data, range, setRange }) => {
    return (
    <Box sx={{ width: '100%', height: 260, bgcolor: 'transparent', p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#222' }}>
          Cumulative TAO Gain
        </Typography>
        <ButtonGroup variant="outlined" size="small" sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {RANGE_OPTIONS.map(opt => (
            <Button
              key={opt.label}
              onClick={() => setRange(opt.label)}
              variant={range === opt.label ? 'contained' : 'outlined'}
              sx={{ minWidth: 36, px: 1, fontWeight: 600 }}
            >
              {opt.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data.length ? data : []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 12, fill: '#888' }} minTickGap={16} />
          <YAxis tick={{ fontSize: 12, fill: '#888' }} width={40} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#222', border: 'none', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: any) => [`${value} TAO`, 'Cumulative Gain']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            fill="url(#colorGain)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CumulativeGainChart; 

export interface StatsBoxProps {
  title?: string;
  totalTAO: number;
  trades: number;
  avgLatency: string;
  successRate: number;
  avgBridgeLatency: string;
}

export const StatsBox: React.FC<StatsBoxProps> = ({ title, totalTAO, trades, avgLatency, successRate, avgBridgeLatency }) => (
  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 1 }}>
    {title && (
      <Typography variant="subtitle2" sx={{ color: '#22c55e', fontWeight: 700, mb: 1, letterSpacing: 0.5 }}>
        {title}
      </Typography>
    )}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      <Box>
        <Typography variant="body2" color="text.secondary">Total TAO netted</Typography>
        <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700 }}>+{totalTAO} TAO</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Trades executed</Typography>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{trades}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Avg. detection latency</Typography>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{avgLatency}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Success rate</Typography>
        <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700 }}>{successRate}%</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Avg. bridge latency</Typography>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{avgBridgeLatency}</Typography>
      </Box>
    </Box>
  </Box>
); 