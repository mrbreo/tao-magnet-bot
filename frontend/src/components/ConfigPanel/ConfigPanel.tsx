import React from 'react';
import { Box, Typography, Slider, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { ConfigSettings } from '../../../../shared/types/config';

interface ConfigPanelProps {
  config: ConfigSettings;
  onChange: (config: ConfigSettings) => void;
}

const MIN_GAIN = 0;
const MAX_GAIN = 100;

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const handleSlider = (field: string, value: number) => {
    if (field === 'minGainThreshold') {
      onChange({ ...config, minGainThreshold: value });
    } else if (field === 'opportunityPriority') {
      // Single slider: 0 = Time priority, 100 = Gain priority
      const timeWeight = 100 - value;
      const gainWeight = value;
      const newPriority = { timeWeight, gainWeight };
      onChange({ ...config, opportunityPriority: newPriority });
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(event.target.value);
    if (isNaN(value)) value = MIN_GAIN;
    if (value < MIN_GAIN) value = MIN_GAIN;
    if (value > MAX_GAIN) value = MAX_GAIN;
    onChange({ ...config, minGainThreshold: value });
  };

  const handleRadio = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  // Calculate opportunity priority slider value (0-100)
  const opportunityPriorityValue = config.opportunityPriority.gainWeight;
  const timePercentage = config.opportunityPriority.timeWeight;
  const gainPercentage = config.opportunityPriority.gainWeight;

  return (
    <Box sx={{ pb: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 4 }}>
        Configuration
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
        Minimum Gain Threshold
      </Typography>
        <TextField
          type="number"
        value={config.minGainThreshold}
          onChange={(event) => {
            let value = Number(event.target.value);
            if (isNaN(value)) value = MIN_GAIN;
            if (value < MIN_GAIN) value = MIN_GAIN;
            if (value > MAX_GAIN) value = MAX_GAIN;
            handleSlider('minGainThreshold', value);
          }}
          inputProps={{ 
            min: MIN_GAIN, 
            max: MAX_GAIN, 
            style: { width: 80 },
            placeholder: "0-100"
          }}
          size="small"
          InputProps={{
            endAdornment: <Typography variant="body2" color="text.secondary">%</Typography>
          }}
      />
      </Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
        Opportunity priority
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Slider
          value={opportunityPriorityValue}
          min={0}
          max={100}
          step={1}
          valueLabelDisplay="auto"
          onChange={(_, v) => handleSlider('opportunityPriority', v as number)}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Time</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="primary">
              Time: {timePercentage}%
            </Typography>
            <Typography variant="body2" color="primary">
              Gain: {gainPercentage}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">Gain</Typography>
        </Box>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
        Bridge Preference
      </Typography>
      <RadioGroup
        row
        value={config.bridgePreference}
        onChange={(_, v) => handleRadio('bridgePreference', v)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="best" control={<Radio />} label="All" sx={{ mr: 3 }} />
        <FormControlLabel value="layerzero" control={<Radio />} label="LayerZero" sx={{ mr: 3 }} />
        <FormControlLabel value="ccip" control={<Radio />} label="CCIP" />
      </RadioGroup>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
        Execution Mode
      </Typography>
      <RadioGroup
        row
        value={config.executionMode}
        onChange={(_, v) => handleRadio('executionMode', v)}
      >
        <FormControlLabel value="auto" control={<Radio />} label="Auto" sx={{ mr: 3 }} />
        <FormControlLabel value="manual" control={<Radio />} label="Manual" />
      </RadioGroup>
    </Box>
  );
};

export default ConfigPanel; 