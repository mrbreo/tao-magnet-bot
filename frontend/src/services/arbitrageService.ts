import axios from 'axios';
import { ArbitrageOpportunity } from '../../../shared/types';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const arbitrageService = {
  // Get all arbitrage opportunities
  getOpportunities: async (): Promise<ArbitrageOpportunity[]> => {
    try {
      const response = await api.get('/api/arbitrage/opportunities');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      return [];
    }
  },

  // Start the arbitrage bot
  startBot: async (): Promise<void> => {
    try {
      await api.post('/api/arbitrage/start');
    } catch (error) {
      console.error('Failed to start bot:', error);
      throw error;
    }
  },

  // Stop the arbitrage bot
  stopBot: async (): Promise<void> => {
    try {
      await api.post('/api/arbitrage/stop');
    } catch (error) {
      console.error('Failed to stop bot:', error);
      throw error;
    }
  },

  // Execute a specific opportunity
  executeOpportunity: async (opportunityId: string): Promise<void> => {
    try {
      await api.post(`/api/arbitrage/execute/${opportunityId}`);
    } catch (error) {
      console.error('Failed to execute opportunity:', error);
      throw error;
    }
  },

  // Get bot status
  getBotStatus: async (): Promise<{ isRunning: boolean; status: string }> => {
    try {
      const response = await api.get('/api/arbitrage/status');
      return response.data;
    } catch (error) {
      console.error('Failed to get bot status:', error);
      return { isRunning: false, status: 'error' };
    }
  },

  // Get configuration
  getConfiguration: async (): Promise<any> => {
    try {
      const response = await api.get('/api/arbitrage/config');
      return response.data;
    } catch (error) {
      console.error('Failed to get configuration:', error);
      throw error;
    }
  },

  // Update configuration
  updateConfiguration: async (config: any): Promise<void> => {
    try {
      await api.put('/api/arbitrage/config', config);
    } catch (error) {
      console.error('Failed to update configuration:', error);
      throw error;
    }
  }
}; 