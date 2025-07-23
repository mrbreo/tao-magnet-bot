import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  data?: Record<string, number>;
  isLoading?: boolean;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, isLoading, height = 300 }) => {
  if (isLoading) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="rectangular" width="100%" height={height} />
      </Box>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No price data available
        </Typography>
      </Box>
    );
  }

  // Transform data for chart
  const chartData = Object.entries(data).map(([chain, price]) => ({
    chain,
    price: parseFloat(price.toFixed(2))
  }));

  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="chain" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`$${value}`, 'Price']}
            labelFormatter={(label: string) => `Chain: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#1976d2" 
            strokeWidth={2}
            dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PriceChart; 