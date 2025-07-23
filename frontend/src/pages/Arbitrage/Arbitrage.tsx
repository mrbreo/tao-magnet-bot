import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Arbitrage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Arbitrage Trading
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Arbitrage Opportunities
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage arbitrage trading opportunities across different exchanges.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trading Pairs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure trading pairs for arbitrage detection.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Set risk parameters and position limits.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Arbitrage; 