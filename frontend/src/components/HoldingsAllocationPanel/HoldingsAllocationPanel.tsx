import React, { useState } from 'react';
import { Box, Typography, Slider, Button, Grid } from '@mui/material';
import { HoldingsAllocation } from '../../../../shared/types/holdings';

interface HoldingsAllocationPanelProps {
  allocation: HoldingsAllocation;
  onAllocate: (allocation: { bittensor: number; ethereum: number; solana: number }) => void;
}

const HoldingsAllocationPanel: React.FC<HoldingsAllocationPanelProps> = ({ allocation, onAllocate }) => {
  const [bittensor, setBittensor] = useState(allocation.allocation.bittensor);
  const [ethereum, setEthereum] = useState(allocation.allocation.ethereum);
  const [solana, setSolana] = useState(allocation.allocation.solana);

  const handleSliderChange = (setter: (v: number) => void, value: number) => {
    setter(value);
  };

  const handleAllocate = () => {
    onAllocate({ bittensor, ethereum, solana });
  };

  return (
    <Box>
      <Typography variant="subtitle1">Current TAO bal</Typography>
      <Typography variant="h5">{allocation.taoBalance.toLocaleString()} TAO</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={4}>
          <Typography>Bittensor</Typography>
          <Slider value={bittensor} onChange={(_, v) => handleSliderChange(setBittensor, v as number)} min={0} max={100} step={1} valueLabelDisplay="auto" />
          <Typography variant="caption">{allocation.bittensor} TAO ({bittensor}%)</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Ethereum</Typography>
          <Slider value={ethereum} onChange={(_, v) => handleSliderChange(setEthereum, v as number)} min={0} max={100} step={1} valueLabelDisplay="auto" />
          <Typography variant="caption">{allocation.ethereum} TAO ({ethereum}%)</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Solana</Typography>
          <Slider value={solana} onChange={(_, v) => handleSliderChange(setSolana, v as number)} min={0} max={100} step={1} valueLabelDisplay="auto" />
          <Typography variant="caption">{allocation.solana} TAO ({solana}%)</Typography>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAllocate}>
        Allocate
      </Button>
    </Box>
  );
};

export default HoldingsAllocationPanel; 