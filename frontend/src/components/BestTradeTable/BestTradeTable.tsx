import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Chip } from '@mui/material';
import { TradeOpportunity, ExecutionMode, BridgePreference } from '../../../../shared/types/trade';

interface BestTradeTableProps {
  opportunities: TradeOpportunity[];
  executionMode: ExecutionMode;
  bridgePreference: BridgePreference;
  onExecute?: (opportunityId: string) => void;
}

const BestTradeTable: React.FC<BestTradeTableProps> = ({ opportunities, executionMode, onExecute }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Pair</TableCell>
          <TableCell>Asset & Amount</TableCell>
          <TableCell>Bridge</TableCell>
          <TableCell>ETA</TableCell>
          <TableCell>Slippage</TableCell>
          <TableCell>Fee</TableCell>
          <TableCell>Gain (TAO)</TableCell>
          <TableCell>Execution</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {opportunities.map((opp) => (
          <TableRow key={opp.id}>
            <TableCell>{opp.pair}</TableCell>
            <TableCell>{opp.assetAmount}</TableCell>
            <TableCell>{opp.bridge}</TableCell>
            <TableCell>{opp.eta} ms</TableCell>
            <TableCell>{opp.slippage} ({opp.slippagePercent}%)</TableCell>
            <TableCell>{opp.fee}</TableCell>
            <TableCell>{opp.gainTAO > 0 ? `+${opp.gainTAO}` : opp.gainTAO}</TableCell>
            <TableCell>
              {executionMode === 'manual' ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => onExecute && onExecute(opp.id)}
                >
                  Execute
                </Button>
              ) : (
                <Chip label={opp.executionStatus} color={opp.executionStatus === 'Pending' ? 'default' : 'success'} size="small" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BestTradeTable; 