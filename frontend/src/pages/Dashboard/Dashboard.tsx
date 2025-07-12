import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Notifications,
  Settings,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useSnackbar } from 'notistack';

// Components
import PriceChart from '../../components/PriceChart/PriceChart';
import OpportunitiesTable from '../../components/OpportunitiesTable/OpportunitiesTable';
import TradingStats from '../../components/TradingStats/TradingStats';
import ConnectionStatus from '../../components/ConnectionStatus/ConnectionStatus';

// Services
import { arbitrageService } from '../../services/arbitrageService';
import { priceService } from '../../services/priceService';

// Store
import { useAppStore } from '../../store/appStore';

// Types
import { ArbitrageOpportunity } from '../../../../shared/types';

const Dashboard: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    isConnected,
    opportunities,
    totalProfit,
    totalTrades,
    currentPrices,
    addOpportunity,
    updateOpportunity,
    setCurrentPrices,
    updateProfit
  } = useAppStore();

  const [isBotRunning, setIsBotRunning] = useState(false);

  // Fetch real-time data
  const { data: priceData, isLoading: priceLoading } = useQuery(
    'prices',
    priceService.getCurrentPrices,
    {
      refetchInterval: 30000, // 30 seconds
      enabled: isConnected
    }
  );

  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery(
    'opportunities',
    arbitrageService.getOpportunities,
    {
      refetchInterval: 10000, // 10 seconds
      enabled: isConnected
    }
  );

  // Update store with fetched data
  useEffect(() => {
    if (priceData) {
      setCurrentPrices(priceData);
    }
  }, [priceData, setCurrentPrices]);

  useEffect(() => {
    if (opportunitiesData) {
      opportunitiesData.forEach((opportunity: ArbitrageOpportunity) => {
        const existing = opportunities.find(opp => opp.id === opportunity.id);
        if (!existing) {
          addOpportunity(opportunity);
        } else {
          updateOpportunity(opportunity.id, opportunity);
        }
      });
    }
  }, [opportunitiesData, opportunities, addOpportunity, updateOpportunity]);

  // Handle bot start/stop
  const handleBotToggle = async () => {
    try {
      if (isBotRunning) {
        await arbitrageService.stopBot();
        setIsBotRunning(false);
        enqueueSnackbar('Bot stopped successfully', { variant: 'info' });
      } else {
        await arbitrageService.startBot();
        setIsBotRunning(true);
        enqueueSnackbar('Bot started successfully', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to toggle bot', { variant: 'error' });
    }
  };

  // Calculate statistics
  const activeOpportunities = opportunities.filter(opp => 
    opp.status === 'pending' || opp.status === 'executing'
  );

  const completedTrades = opportunities.filter(opp => 
    opp.status === 'completed'
  );

  const totalProfitToday = completedTrades
    .filter(opp => {
      const today = new Date();
      const oppDate = new Date(opp.timestamp);
      return oppDate.toDateString() === today.toDateString();
    })
    .reduce((sum, opp) => sum + (opp.actualProfit || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          TAO Magnet Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ConnectionStatus />
          
          <Tooltip title={isBotRunning ? 'Stop Bot' : 'Start Bot'}>
            <IconButton
              onClick={handleBotToggle}
              color={isBotRunning ? 'error' : 'success'}
              sx={{ 
                backgroundColor: isBotRunning ? 'error.main' : 'success.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: isBotRunning ? 'error.dark' : 'success.dark'
                }
              }}
            >
              {isBotRunning ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Profit
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${totalProfit.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Today: ${totalProfitToday.toFixed(2)}
                  </Typography>
                </Box>
                <AccountBalance color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Trades
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalTrades}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Success Rate: {completedTrades.length > 0 ? 
                      ((completedTrades.length / opportunities.length) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
                <ShowChart color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Opportunities
                  </Typography>
                  <Typography variant="h4" component="div">
                    {activeOpportunities.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending: {activeOpportunities.filter(opp => opp.status === 'pending').length}
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Bot Status
                  </Typography>
                  <Typography variant="h6" component="div">
                    {isBotRunning ? 'Running' : 'Stopped'}
                  </Typography>
                  <Chip
                    label={isBotRunning ? 'Active' : 'Inactive'}
                    color={isBotRunning ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Settings color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Price Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                TAO Price Across Chains
              </Typography>
              <PriceChart 
                data={priceData} 
                isLoading={priceLoading}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Trading Stats */}
        <Grid item xs={12} lg={4}>
          <TradingStats />
        </Grid>

        {/* Opportunities Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Arbitrage Opportunities
              </Typography>
              <OpportunitiesTable 
                opportunities={opportunities.slice(0, 10)}
                isLoading={opportunitiesLoading}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 