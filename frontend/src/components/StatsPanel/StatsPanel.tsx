import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { StatsMetrics } from '../../../../shared/types/stats';

interface StatsPanelProps {
  stats: StatsMetrics;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Total TAO netted: <b>+{stats.totalTAONetted} TAO</b></Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Trades executed: <b>{stats.tradesExecuted}</b></Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Success rate: <b>{stats.successRate}%</b></Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Avg. detection latency: <b>{stats.avgDetectionLatency} ms</b></Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Avg. bridge latency: <b>{stats.avgBridgeLatency} s</b></Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPanel; 