import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { ExecutionLogEntry } from '../../../../shared/types/executionLog';

interface ExecutionLogTableProps {
  log: ExecutionLogEntry[];
}

const ExecutionLogTable: React.FC<ExecutionLogTableProps> = ({ log }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Pair</TableCell>
          <TableCell>Asset & Amount</TableCell>
          <TableCell>Bridge</TableCell>
          <TableCell>ETA</TableCell>
          <TableCell>Exec Time</TableCell>
          <TableCell>Slippage</TableCell>
          <TableCell>Fee</TableCell>
          <TableCell>Gain (TAO)</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {log.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.time}</TableCell>
            <TableCell>{entry.pair}</TableCell>
            <TableCell>{entry.assetAmount}</TableCell>
            <TableCell>{entry.bridge}</TableCell>
            <TableCell>{entry.eta} ms</TableCell>
            <TableCell>{entry.execTime} ms</TableCell>
            <TableCell>{entry.slippage} ({entry.slippagePercent}%)</TableCell>
            <TableCell>{entry.fee}</TableCell>
            <TableCell>{entry.gainTAO > 0 ? `+${entry.gainTAO}` : entry.gainTAO}</TableCell>
            <TableCell>
              <Chip label={entry.status} color={entry.status === 'done' ? 'success' : 'error'} size="small" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExecutionLogTable; 