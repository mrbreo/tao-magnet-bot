import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Analytics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Performance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View detailed analytics and performance metrics for your trading activities.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profit & Loss
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your profit and loss over time with detailed breakdowns.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trading Volume
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor trading volume and frequency across different time periods.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Success Rate
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Analyze the success rate of your arbitrage opportunities.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Metrics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View risk metrics including Sharpe ratio, drawdown, and volatility.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 