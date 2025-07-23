import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemIcon, Chip, IconButton } from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Warning as WarningIcon, 
  Error as ErrorIcon, 
  Info as InfoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const Alerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'info',
      message: 'New arbitrage opportunity detected: BTC/USDT spread 0.8%',
      timestamp: '2024-01-15 14:30:25',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      message: 'High slippage detected on ETH/USDT trade',
      timestamp: '2024-01-15 14:25:10',
      read: true
    },
    {
      id: 3,
      type: 'error',
      message: 'Failed to execute trade on Binance: Insufficient funds',
      timestamp: '2024-01-15 14:20:45',
      read: false
    },
    {
      id: 4,
      type: 'info',
      message: 'Daily profit target reached: $1,250',
      timestamp: '2024-01-15 14:15:30',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      message: 'Network latency high: 250ms average response time',
      timestamp: '2024-01-15 14:10:15',
      read: false
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Alerts & Notifications
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Alerts
              </Typography>
              <Chip label={`${alerts.filter(a => !a.read).length} unread`} color="primary" size="small" />
            </Box>
            <List>
              {alerts.map((alert) => (
                <ListItem
                  key={alert.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: alert.read ? 'transparent' : 'action.hover'
                  }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.message}
                    secondary={alert.timestamp}
                    primaryTypographyProps={{
                      fontWeight: alert.read ? 'normal' : 'bold'
                    }}
                  />
                  <Chip 
                    label={alert.type.toUpperCase()} 
                    color={getAlertColor(alert.type) as any}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alert Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure which types of alerts you want to receive and how you want to be notified.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Trade execution alerts<br/>
              • Profit/loss notifications<br/>
              • Error and warning messages<br/>
              • System status updates<br/>
              • Risk management alerts
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alert Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h4" color="primary">
                  {alerts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Alerts
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="warning.main">
                  {alerts.filter(a => a.type === 'warning').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Warnings
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="error.main">
                  {alerts.filter(a => a.type === 'error').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Errors
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="info.main">
                  {alerts.filter(a => a.type === 'info').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Info
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Alerts; 