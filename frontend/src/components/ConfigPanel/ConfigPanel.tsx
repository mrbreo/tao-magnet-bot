import React from 'react';
import { Box, Typography, Slider, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import { ConfigSettings } from '../../../../shared/types/config';

interface ConfigPanelProps {
  config: ConfigSettings;
  onChange: (config: ConfigSettings) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const handleSlider = (field: string, value: number) => {
    if (field === 'minGainThreshold') {
      onChange({ ...config, minGainThreshold: value });
    } else if (field === 'timeWeight' || field === 'gainWeight') {
      const newPriority = { ...config.opportunityPriority, [field]: value };
      onChange({ ...config, opportunityPriority: newPriority });
    }
  };

  const handleRadio = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Box>
      <Typography variant="subtitle1">Minimum Gain Threshold</Typography>
      <Slider
        value={config.minGainThreshold}
        min={0}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        onChange={(_, v) => handleSlider('minGainThreshold', v as number)}
      />
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Opportunity priority</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Time</Typography>
          <Slider
            value={config.opportunityPriority.timeWeight}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            onChange={(_, v) => handleSlider('timeWeight', v as number)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Gain</Typography>
          <Slider
            value={config.opportunityPriority.gainWeight}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            onChange={(_, v) => handleSlider('gainWeight', v as number)}
          />
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Bridge Preference</Typography>
      <RadioGroup
        row
        value={config.bridgePreference}
        onChange={(_, v) => handleRadio('bridgePreference', v)}
      >
        <FormControlLabel value="best" control={<Radio />} label="Best Price" />
        <FormControlLabel value="layerzero" control={<Radio />} label="LayerZero" />
        <FormControlLabel value="ccip" control={<Radio />} label="CCIP" />
      </RadioGroup>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Execution Mode</Typography>
      <RadioGroup
        row
        value={config.executionMode}
        onChange={(_, v) => handleRadio('executionMode', v)}
      >
        <FormControlLabel value="auto" control={<Radio />} label="Auto" />
        <FormControlLabel value="manual" control={<Radio />} label="Manual" />
      </RadioGroup>
    </Box>
  );
};

export default ConfigPanel; 