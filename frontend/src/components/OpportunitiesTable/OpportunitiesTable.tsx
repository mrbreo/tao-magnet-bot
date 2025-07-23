import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Skeleton,
  Box
} from '@mui/material';
import { ArbitrageOpportunity } from '../../../../shared/types';

interface OpportunitiesTableProps {
  opportunities: ArbitrageOpportunity[];
  isLoading?: boolean;
}

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = ({ opportunities, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'executing':
        return 'info';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  if (opportunities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No arbitrage opportunities found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell>Source Chain</TableCell>
            <TableCell>Target Chain</TableCell>
            <TableCell>Price Difference</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Estimated Profit</TableCell>
            <TableCell>Risk Score</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {opportunity.token}
                </Typography>
              </TableCell>
              <TableCell>{opportunity.sourceChain}</TableCell>
              <TableCell>{opportunity.targetChain}</TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  color={opportunity.priceDifference > 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(opportunity.priceDifference)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  color={opportunity.percentageDifference > 0 ? 'success.main' : 'error.main'}
                >
                  {formatPercentage(opportunity.percentageDifference)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(opportunity.estimatedProfit)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={`${opportunity.riskScore.toFixed(1)}/10`}
                  color={opportunity.riskScore <= 3 ? 'success' : opportunity.riskScore <= 7 ? 'warning' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={opportunity.status}
                  color={getStatusColor(opportunity.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(opportunity.timestamp).toLocaleTimeString()}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OpportunitiesTable; 