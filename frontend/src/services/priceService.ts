import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const priceService = {
  // Get current prices for all supported tokens
  getCurrentPrices: async (): Promise<Record<string, number>> => {
    try {
      const response = await api.get('/api/prices/current');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current prices:', error);
      return {};
    }
  },

  // Get price history for a specific token
  getPriceHistory: async (token: string, timeframe: string = '24h'): Promise<any[]> => {
    try {
      const response = await api.get(`/api/prices/history/${token}`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch price history:', error);
      return [];
    }
  },

  // Get price data for specific chains
  getChainPrices: async (chains: string[]): Promise<Record<string, number>> => {
    try {
      const response = await api.post('/api/prices/chains', { chains });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch chain prices:', error);
      return {};
    }
  },

  // Get price alerts
  getPriceAlerts: async (): Promise<any[]> => {
    try {
      const response = await api.get('/api/prices/alerts');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch price alerts:', error);
      return [];
    }
  },

  // Set price alert
  setPriceAlert: async (token: string, targetPrice: number, type: 'above' | 'below'): Promise<void> => {
    try {
      await api.post('/api/prices/alerts', {
        token,
        targetPrice,
        type
      });
    } catch (error) {
      console.error('Failed to set price alert:', error);
      throw error;
    }
  },

  // Get supported tokens
  getSupportedTokens: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/prices/tokens');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch supported tokens:', error);
      return [];
    }
  },

  // Get supported chains
  getSupportedChains: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/prices/chains');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch supported chains:', error);
      return [];
    }
  }
}; 