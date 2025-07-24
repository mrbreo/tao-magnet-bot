import React, { useState } from 'react';
import { Box, Typography, Slider, Button, Grid, Divider } from '@mui/material';
import { HoldingsAllocation } from '../../../../shared/types/holdings';

interface HoldingsAllocationPanelProps {
  allocation: HoldingsAllocation;
  onAllocate: (allocation: { bittensor: number; ethereum: number; solana: number }) => void;
}

const monoFont = {
  fontFamily: 'Roboto Mono, monospace',
};

const HoldingsAllocationPanel: React.FC<HoldingsAllocationPanelProps> = ({ allocation, onAllocate }) => {
  const [bittensor, setBittensor] = useState(allocation.allocation.bittensor);
  const [ethereum, setEthereum] = useState(allocation.allocation.ethereum);
  const [solana, setSolana] = useState(allocation.allocation.solana);

  // Simple: When Bittensor changes, others adjust proportionally
  const handleBittensorChange = (value: number) => {
    const newBittensor = Math.max(0, Math.min(100, value));
    const change = newBittensor - bittensor;
    
    if (change === 0) return;
    
    // Calculate how much others need to change (opposite direction)
    const othersChange = -change;
    const totalOthers = ethereum + solana;
    
    if (totalOthers > 0) {
      // Distribute change proportionally based on current ratios
      const ethereumRatio = ethereum / totalOthers;
      const solanaRatio = solana / totalOthers;
      
      const newEthereum = Math.max(0, ethereum + (othersChange * ethereumRatio));
      const newSolana = Math.max(0, solana + (othersChange * solanaRatio));
      
      setBittensor(newBittensor);
      setEthereum(Math.round(newEthereum));
      setSolana(Math.round(newSolana));
    } else {
      // If both others are 0, split remaining 50/50
      const remaining = 100 - newBittensor;
      setBittensor(newBittensor);
      setEthereum(Math.round(remaining / 2));
      setSolana(remaining - Math.round(remaining / 2));
    }
  };

  // When Ethereum changes, normalize to keep total at 100%
  const handleEthereumChange = (value: number) => {
    const newEthereum = Math.max(0, Math.min(100, value));
    const total = bittensor + newEthereum + solana;
    
    if (total > 100) {
      // Normalize: distribute excess proportionally between Bittensor and Solana
      const excess = total - 100;
      const totalOthers = bittensor + solana;
      
      if (totalOthers > 0) {
        const bittensorRatio = bittensor / totalOthers;
        const solanaRatio = solana / totalOthers;
        
        const bittensorReduction = excess * bittensorRatio;
        const solanaReduction = excess * solanaRatio;
        
        setEthereum(newEthereum);
        setBittensor(Math.max(0, bittensor - bittensorReduction));
        setSolana(Math.max(0, solana - solanaReduction));
      } else {
        // If both others are 0, set Ethereum to 100%
        setEthereum(100);
        setBittensor(0);
        setSolana(0);
      }
    } else {
      // Simple case: just adjust Solana
      const remaining = 100 - bittensor - newEthereum;
      setEthereum(newEthereum);
      setSolana(Math.max(0, remaining));
    }
  };

  // When Solana changes, normalize to keep total at 100%
  const handleSolanaChange = (value: number) => {
    const newSolana = Math.max(0, Math.min(100, value));
    const total = bittensor + ethereum + newSolana;
    
    if (total > 100) {
      // Normalize: distribute excess proportionally between Bittensor and Ethereum
      const excess = total - 100;
      const totalOthers = bittensor + ethereum;
      
      if (totalOthers > 0) {
        const bittensorRatio = bittensor / totalOthers;
        const ethereumRatio = ethereum / totalOthers;
        
        const bittensorReduction = excess * bittensorRatio;
        const ethereumReduction = excess * ethereumRatio;
        
        setSolana(newSolana);
        setBittensor(Math.max(0, bittensor - bittensorReduction));
        setEthereum(Math.max(0, ethereum - ethereumReduction));
      } else {
        // If both others are 0, set Solana to 100%
        setSolana(100);
        setBittensor(0);
        setEthereum(0);
      }
    } else {
      // Simple case: just adjust Ethereum
      const remaining = 100 - bittensor - newSolana;
      setSolana(newSolana);
      setEthereum(Math.max(0, remaining));
    }
  };

  const handleAllocate = () => {
    onAllocate({ bittensor, ethereum, solana });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 0 }}>
      {/* Panel Title */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, letterSpacing: 0.5 }}>
        TAO Holdings & Allocation
      </Typography>
      {/* Current TAO bal section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 0.5 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          Current TAO bal
        </Typography>
        <Typography variant="h5" sx={{ ...monoFont, fontWeight: 700, fontSize: '2rem', color: '#fff' }}>
          {allocation.taoBalance.toLocaleString()} TAO
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      {/* Asset breakdown - FIXED: Use local state values */}
      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        <Grid item xs={6}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>Bittensor</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ ...monoFont, fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            {Math.round(allocation.taoBalance * bittensor / 100)} TAO ({bittensor}%)
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>Ethereum</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ ...monoFont, fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            {Math.round(allocation.taoBalance * ethereum / 100)} TAO ({ethereum}%)
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>Solana</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ ...monoFont, fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            {Math.round(allocation.taoBalance * solana / 100)} TAO ({solana}%)
          </Typography>
        </Grid>
      </Grid>
      {/* Allocation subheading */}
      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.2, mt: 1, mb: 0.5 }}>
        Allocation
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {/* Sliders - FIXED: All have 0-100 range, positions match percentages */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
          <Typography variant="body1" sx={{ width: 90, fontWeight: 500 }}>Bittensor</Typography>
          <Slider value={bittensor} onChange={(_, v) => handleBittensorChange(v as number)} min={0} max={100} step={1} sx={{ flex: 1, mx: 2 }} size="medium" componentsProps={{ thumb: { style: { height: 22, width: 22 } } }} />
          <Typography variant="body1" sx={{ ...monoFont, width: 44, textAlign: 'right', fontWeight: 700 }}>{bittensor}%</Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
          <Typography variant="body1" sx={{ width: 90, fontWeight: 500 }}>Ethereum</Typography>
          <Slider value={ethereum} onChange={(_, v) => handleEthereumChange(v as number)} min={0} max={100} step={1} sx={{ flex: 1, mx: 2 }} size="medium" componentsProps={{ thumb: { style: { height: 22, width: 22 } } }} />
          <Typography variant="body1" sx={{ ...monoFont, width: 44, textAlign: 'right', fontWeight: 700 }}>{ethereum}%</Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
          <Typography variant="body1" sx={{ width: 90, fontWeight: 500 }}>Solana</Typography>
          <Slider value={solana} onChange={(_, v) => handleSolanaChange(v as number)} min={0} max={100} step={1} sx={{ flex: 1, mx: 2 }} size="medium" componentsProps={{ thumb: { style: { height: 22, width: 22 } } }} />
          <Typography variant="body1" sx={{ ...monoFont, width: 44, textAlign: 'right', fontWeight: 700 }}>{solana}%</Typography>
        </Grid>
      </Grid>
      {/* Allocate button bottom right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button variant="outlined" color="primary" size="medium" sx={{ px: 3, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', boxShadow: 'none', borderWidth: 2 }} onClick={handleAllocate}>
          Allocate
        </Button>
      </Box>
    </Box>
  );
};

export default HoldingsAllocationPanel; 