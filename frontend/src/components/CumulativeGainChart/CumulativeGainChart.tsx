import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TAOGainPoint } from '../../../../shared/types/stats';

interface CumulativeGainChartProps {
  data: TAOGainPoint[];
}

const CumulativeGainChart: React.FC<CumulativeGainChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <XAxis dataKey="timestamp" hide />
        <YAxis width={40} />
        <Tooltip formatter={(value: number) => `+${value} TAO`} />
        <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CumulativeGainChart; 