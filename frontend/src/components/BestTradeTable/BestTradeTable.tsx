import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Grid, Divider } from '@mui/material';
import { TradeOpportunity, ExecutionMode, BridgePreference } from '../../../../shared/types/trade';

interface BestTradeTableProps {
  opportunities: TradeOpportunity[];
  executionMode: ExecutionMode;
  bridgePreference: BridgePreference;
  onExecute?: (opportunityId: string) => void;
}

const BestTradeCard: React.FC<{
  opp: TradeOpportunity;
  executionMode: ExecutionMode;
  onExecute?: (opportunityId: string) => void;
}> = ({ opp, executionMode, onExecute }) => (
  <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2, bgcolor: 'background.paper', p: 0, minWidth: 0 }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{opp.pair}</Typography>
        <Chip
          label={
            executionMode === 'manual'
              ? opp.executionStatus === 'Pending'
                ? 'Pending'
                : 'Executed'
              : opp.executionStatus
          }
          color={opp.executionStatus === 'Executed' ? 'success' : opp.executionStatus === 'Pending' ? 'default' : 'error'}
          size="small"
        />
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Grid container spacing={1}>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">Asset</Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{opp.assetAmount}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">Bridge</Typography>
          <Typography variant="body1">{opp.bridge}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">ETA</Typography>
          <Typography variant="body1">{opp.eta} ms</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">Slippage</Typography>
          <Typography variant="body1">{opp.slippage} ({opp.slippagePercent}%)</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">Fee</Typography>
          <Typography variant="body1">{opp.fee}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">Gain (TAO)</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: opp.gainTAO > 0 ? 'success.main' : 'error.main' }}>{opp.gainTAO > 0 ? `+${opp.gainTAO}` : opp.gainTAO}</Typography>
        </Grid>
      </Grid>
      {executionMode === 'manual' && opp.executionStatus === 'Pending' && (
                <Button
                  variant="contained"
                  color="primary"
          size="medium"
          sx={{ mt: 2, width: '100%', fontWeight: 700 }}
                  onClick={() => onExecute && onExecute(opp.id)}
                >
                  Execute
                </Button>
      )}
      {executionMode === 'manual' && opp.executionStatus === 'Executed' && (
        <Box sx={{ mt: 2 }}>
          <Chip label="Executed" color="success" size="medium" />
        </Box>
              )}
    </CardContent>
  </Card>
);

const BestTradeTable: React.FC<BestTradeTableProps> = ({ opportunities, executionMode, onExecute }) => {
  return (
    <Grid container spacing={2}>
      {opportunities.map((opp) => (
        <Grid item xs={12} sm={6} key={opp.id}>
          <BestTradeCard opp={opp} executionMode={executionMode} onExecute={onExecute} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BestTradeTable; 