import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider } from '@mui/material';
import { useAppStore } from '../../store/appStore';

const TradingStats: React.FC = () => {
  const { opportunities, totalProfit, totalTrades } = useAppStore();

  const completedTrades = opportunities.filter(opp => opp.status === 'completed');
  const failedTrades = opportunities.filter(opp => opp.status === 'failed');
  const pendingTrades = opportunities.filter(opp => opp.status === 'pending');

  const successRate = totalTrades > 0 ? (completedTrades.length / totalTrades) * 100 : 0;
  const averageProfit = completedTrades.length > 0 
    ? completedTrades.reduce((sum, trade) => sum + (trade.actualProfit || 0), 0) / completedTrades.length 
    : 0;

  const stats = [
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      color: 'success.main'
    },
    {
      label: 'Avg Profit',
      value: `$${averageProfit.toFixed(2)}`,
      color: 'primary.main'
    },
    {
      label: 'Pending',
      value: pendingTrades.length.toString(),
      color: 'warning.main'
    },
    {
      label: 'Failed',
      value: failedTrades.length.toString(),
      color: 'error.main'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trading Statistics
        </Typography>
        
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid item xs={6} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ color: stat.color, fontWeight: 'bold' }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recent Performance
          </Typography>
          <Typography variant="body2">
            Total Profit: <strong>${totalProfit.toFixed(2)}</strong>
          </Typography>
          <Typography variant="body2">
            Total Trades: <strong>{totalTrades}</strong>
          </Typography>
          <Typography variant="body2">
            Completed: <strong>{completedTrades.length}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TradingStats; 