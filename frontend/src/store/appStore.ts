import { create } from 'zustand';
import { ArbitrageOpportunity, BotConfiguration, Alert } from '../../../shared/types';

interface AppState {
  // Connection status
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  
  // Arbitrage opportunities
  opportunities: ArbitrageOpportunity[];
  activeOpportunities: ArbitrageOpportunity[];
  
  // Bot configuration
  configuration: BotConfiguration;
  
  // Alerts and notifications
  alerts: Alert[];
  unreadAlerts: number;
  
  // Real-time data
  currentPrices: Record<string, number>;
  totalProfit: number;
  totalTrades: number;
  
  // UI state
  sidebarOpen: boolean;
  selectedPage: string;
  
  // Actions
  setConnectionStatus: (status: AppState['connectionStatus']) => void;
  addOpportunity: (opportunity: ArbitrageOpportunity) => void;
  updateOpportunity: (id: string, updates: Partial<ArbitrageOpportunity>) => void;
  setConfiguration: (config: Partial<BotConfiguration>) => void;
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (id: string) => void;
  setCurrentPrices: (prices: Record<string, number>) => void;
  updateProfit: (profit: number) => void;
  updateTradeCount: (count: number) => void;
  toggleSidebar: () => void;
  setSelectedPage: (page: string) => void;
}



const defaultConfiguration: BotConfiguration = {
  minProfitThreshold: 10,
  maxSlippage: 0.5,
  gasPriceMultiplier: 1.1,
  maxConcurrentTrades: 3,
  riskTolerance: 0.7,
  enabledChains: ['bittensor', 'ethereum', 'solana'],
  enabledTokens: ['TAO', 'ALPHA_SN100', 'ALPHA_SN101', 'ALPHA_SN102'],
  tradingHours: {
    start: '00:00',
    end: '23:59'
  }
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isConnected: false,
  connectionStatus: 'disconnected',
  opportunities: [],
  activeOpportunities: [],
  configuration: defaultConfiguration,
  alerts: [],
  unreadAlerts: 0,
  currentPrices: {},
  totalProfit: 0,
  totalTrades: 0,
  sidebarOpen: true,
  selectedPage: 'dashboard',

  // Actions
  setConnectionStatus: (status) => set({ 
    connectionStatus: status,
    isConnected: status === 'connected'
  }),

  addOpportunity: (opportunity) => set((state) => {
    const newOpportunities = [...state.opportunities, opportunity];
    const activeOpportunities = newOpportunities.filter(opp => 
      opp.status === 'pending' || opp.status === 'executing'
    );
    
    return {
      opportunities: newOpportunities,
      activeOpportunities
    };
  }),

  updateOpportunity: (id, updates) => set((state) => {
    const updatedOpportunities = state.opportunities.map(opp =>
      opp.id === id ? { ...opp, ...updates } : opp
    );
    
    const activeOpportunities = updatedOpportunities.filter(opp => 
      opp.status === 'pending' || opp.status === 'executing'
    );
    
    return {
      opportunities: updatedOpportunities,
      activeOpportunities
    };
  }),

  setConfiguration: (config) => set((state) => ({
    configuration: { ...state.configuration, ...config }
  })),

  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts],
    unreadAlerts: state.unreadAlerts + 1
  })),

  markAlertAsRead: (id) => set((state) => {
    const updatedAlerts = state.alerts.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    );
    
    const unreadCount = updatedAlerts.filter(alert => !alert.isRead).length;
    
    return {
      alerts: updatedAlerts,
      unreadAlerts: unreadCount
    };
  }),

  setCurrentPrices: (prices) => set({ currentPrices: prices }),

  updateProfit: (profit) => set((state) => ({
    totalProfit: state.totalProfit + profit
  })),

  updateTradeCount: (count) => set((state) => ({
    totalTrades: state.totalTrades + count
  })),

  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),

  setSelectedPage: (page) => set({ selectedPage: page })
})); 