import React from 'react';
import { Box, Typography, Paper, Grid, Switch, FormControlLabel, TextField, Button } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trading Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Profit Threshold (%)"
                  type="number"
                  defaultValue={0.5}
                  helperText="Minimum profit percentage to execute trades"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Position Size (USD)"
                  type="number"
                  defaultValue={1000}
                  helperText="Maximum amount to invest per trade"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Daily Trading Limit (USD)"
                  type="number"
                  defaultValue={10000}
                  helperText="Maximum daily trading volume"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Slippage Tolerance (%)"
                  type="number"
                  defaultValue={0.1}
                  helperText="Maximum acceptable slippage"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="SMS Alerts"
            />
            <FormControlLabel
              control={<Switch />}
              label="Desktop Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Trade Execution Alerts"
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Management
            </Typography>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-stop on Loss"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Circuit Breaker"
            />
            <FormControlLabel
              control={<Switch />}
              label="Emergency Stop"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Position Monitoring"
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Backend API URL"
                  defaultValue="http://localhost:3001"
                  helperText="Backend service endpoint"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WebSocket URL"
                  defaultValue="ws://localhost:3001"
                  helperText="Real-time data endpoint"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Save Settings
              </Button>
              <Button variant="outlined" sx={{ ml: 2 }}>
                Reset to Defaults
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 