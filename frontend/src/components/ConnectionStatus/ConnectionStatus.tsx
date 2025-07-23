import React from 'react';
import { Box, Chip } from '@mui/material';
import { useAppStore } from '../../store/appStore';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus } = useAppStore();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'warning';
      case 'disconnected':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        label={getStatusText()}
        color={getStatusColor() as any}
        size="small"
        variant="outlined"
      />
    </Box>
  );
};

export default ConnectionStatus; 