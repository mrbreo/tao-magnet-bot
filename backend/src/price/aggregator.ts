import { EventEmitter } from 'events';
import axios from 'axios';
import { logger } from '../core/logger';
import { PriceData, TokenType, ChainType } from '../../shared/types';

export class PriceAggregator extends EventEmitter {
  private isRunning: boolean = false;
  private priceCache: Map<string, PriceData> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private dataSources: Map<string, any> = new Map();

  // Supported tokens and chains
  private readonly supportedTokens = [
    { symbol: 'TAO', type: TokenType.TAO },
    { symbol: 'ALPHA_SN100', type: TokenType.ALPHA },
    { symbol: 'ALPHA_SN101', type: TokenType.ALPHA },
    { symbol: 'ALPHA_SN102', type: TokenType.ALPHA }
  ];

  private readonly supportedChains = [
    { id: 'bittensor', type: ChainType.BITTENSOR },
    { id: 'ethereum', type: ChainType.ETHEREUM },
    { id: 'solana', type: ChainType.SOLANA }
  ];

  constructor() {
    super();
    this.initializeDataSources();
  }

  private initializeDataSources(): void {
    // Initialize different data sources for price feeds
    this.dataSources.set('bittensor', {
      name: 'Bittensor Network',
      baseUrl: process.env.BITTENSOR_RPC_URL || 'https://bittensor-rpc.com',
      apiKey: process.env.BITTENSOR_API_KEY
    });

    this.dataSources.set('ethereum', {
      name: 'Ethereum DEX Aggregators',
      baseUrl: 'https://api.1inch.io/v5.0',
      apiKey: process.env.ETHEREUM_API_KEY
    });

    this.dataSources.set('solana', {
      name: 'Solana DEX Aggregators',
      baseUrl: 'https://api.jup.ag/v4',
      apiKey: process.env.SOLANA_API_KEY
    });

    // CoinGecko for backup price data
    this.dataSources.set('coingecko', {
      name: 'CoinGecko',
      baseUrl: 'https://api.coingecko.com/api/v3',
      apiKey: process.env.COINGECKO_API_KEY
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Price aggregator is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting price aggregator');

    // Start initial price fetch
    await this.fetchAllPrices();

    // Set up periodic price updates
    this.updateInterval = setInterval(async () => {
      await this.fetchAllPrices();
    }, 30000); // Update every 30 seconds

    logger.info('Price aggregator started successfully');
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    logger.info('Price aggregator stopped');
  }

  private async fetchAllPrices(): Promise<void> {
    try {
      const pricePromises = [];

      // Fetch TAO prices across all chains
      for (const chain of this.supportedChains) {
        pricePromises.push(this.fetchTAOPrice(chain.id));
      }

      // Fetch alpha token prices
      for (const token of this.supportedTokens.filter(t => t.type === TokenType.ALPHA)) {
        for (const chain of this.supportedChains) {
          pricePromises.push(this.fetchAlphaTokenPrice(token.symbol, chain.id));
        }
      }

      const results = await Promise.allSettled(pricePromises);
      
      // Process results and emit updates
      const validPrices: PriceData[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          validPrices.push(result.value);
          this.priceCache.set(result.value.token + '_' + result.value.chain, result.value);
        }
      });

      // Emit aggregated price data
      this.emit('priceUpdate', this.aggregatePriceData(validPrices));
      
      logger.debug(`Fetched ${validPrices.length} price updates`);

    } catch (error) {
      logger.error('Error fetching prices:', error);
    }
  }

  private async fetchTAOPrice(chain: string): Promise<PriceData | null> {
    try {
      let price: number;
      let volume24h: number = 0;
      let source: string;

      switch (chain) {
        case 'bittensor':
          price = await this.fetchBittensorTAOPrice();
          source = 'bittensor_network';
          break;

        case 'ethereum':
          price = await this.fetchEthereumTAOPrice();
          source = 'ethereum_dex';
          break;

        case 'solana':
          price = await this.fetchSolanaTAOPrice();
          source = 'solana_dex';
          break;

        default:
          return null;
      }

      if (price && price > 0) {
        return {
          token: 'TAO',
          chain,
          price,
          volume24h,
          timestamp: new Date(),
          source,
          confidence: 0.9
        };
      }

      return null;
    } catch (error) {
      logger.error(`Error fetching TAO price for ${chain}:`, error);
      return null;
    }
  }

  private async fetchAlphaTokenPrice(tokenSymbol: string, chain: string): Promise<PriceData | null> {
    try {
      let price: number;
      let source: string;

      switch (chain) {
        case 'bittensor':
          price = await this.fetchBittensorAlphaPrice(tokenSymbol);
          source = 'bittensor_subnet';
          break;

        case 'ethereum':
          price = await this.fetchEthereumAlphaPrice(tokenSymbol);
          source = 'ethereum_dex';
          break;

        case 'solana':
          price = await this.fetchSolanaAlphaPrice(tokenSymbol);
          source = 'solana_dex';
          break;

        default:
          return null;
      }

      if (price && price > 0) {
        return {
          token: tokenSymbol,
          chain,
          price,
          volume24h: 0,
          timestamp: new Date(),
          source,
          confidence: 0.8
        };
      }

      return null;
    } catch (error) {
      logger.error(`Error fetching ${tokenSymbol} price for ${chain}:`, error);
      return null;
    }
  }

  // Bittensor price fetching methods
  private async fetchBittensorTAOPrice(): Promise<number> {
    try {
      const source = this.dataSources.get('bittensor');
      const response = await axios.get(`${source.baseUrl}/price/tao`, {
        headers: { 'Authorization': `Bearer ${source.apiKey}` }
      });

      return response.data.price || 0;
    } catch (error) {
      logger.error('Error fetching Bittensor TAO price:', error);
      return 0;
    }
  }

  private async fetchBittensorAlphaPrice(tokenSymbol: string): Promise<number> {
    try {
      const source = this.dataSources.get('bittensor');
      const subnetId = tokenSymbol.split('_')[1];
      
      const response = await axios.get(`${source.baseUrl}/subnet/${subnetId}/alpha-price`, {
        headers: { 'Authorization': `Bearer ${source.apiKey}` }
      });

      return response.data.price || 0;
    } catch (error) {
      logger.error(`Error fetching Bittensor ${tokenSymbol} price:`, error);
      return 0;
    }
  }

  // Ethereum price fetching methods
  private async fetchEthereumTAOPrice(): Promise<number> {
    try {
      // Simulate fetching from Ethereum DEX (Uniswap, etc.)
      // In real implementation, this would query actual DEX APIs
      const response = await axios.get('https://api.1inch.io/v5.0/1/quote', {
        params: {
          fromTokenAddress: '0x0000000000000000000000000000000000000000', // ETH
          toTokenAddress: '0xTAO_CONTRACT_ADDRESS', // TAO contract
          amount: '1000000000000000000' // 1 ETH
        }
      });

      return response.data.toTokenAmount / response.data.fromTokenAmount;
    } catch (error) {
      logger.error('Error fetching Ethereum TAO price:', error);
      return 0;
    }
  }

  private async fetchEthereumAlphaPrice(tokenSymbol: string): Promise<number> {
    try {
      // Simulate fetching alpha token price from Ethereum
      // This would query actual DEX APIs when bridges are available
      return 0; // Placeholder until bridges are implemented
    } catch (error) {
      logger.error(`Error fetching Ethereum ${tokenSymbol} price:`, error);
      return 0;
    }
  }

  // Solana price fetching methods
  private async fetchSolanaTAOPrice(): Promise<number> {
    try {
      // Simulate fetching from Solana DEX (Jupiter, etc.)
      const response = await axios.get('https://price.jup.ag/v4/price', {
        params: {
          ids: 'TAO_TOKEN_ID'
        }
      });

      return response.data.data.TAO_TOKEN_ID?.price || 0;
    } catch (error) {
      logger.error('Error fetching Solana TAO price:', error);
      return 0;
    }
  }

  private async fetchSolanaAlphaPrice(tokenSymbol: string): Promise<number> {
    try {
      // Simulate fetching alpha token price from Solana
      return 0; // Placeholder until bridges are implemented
    } catch (error) {
      logger.error(`Error fetching Solana ${tokenSymbol} price:`, error);
      return 0;
    }
  }

  private aggregatePriceData(prices: PriceData[]): any {
    const aggregated = {
      tao: {},
      alphaTokens: {}
    };

    prices.forEach(price => {
      if (price.token === 'TAO') {
        aggregated.tao[price.chain] = price.price;
      } else if (price.token.startsWith('ALPHA_')) {
        if (!aggregated.alphaTokens[price.token]) {
          aggregated.alphaTokens[price.token] = {};
        }
        aggregated.alphaTokens[price.token][price.chain] = price.price;
      }
    });

    return aggregated;
  }

  // Public methods
  public getLatestPrices(): Map<string, PriceData> {
    return new Map(this.priceCache);
  }

  public getPrice(token: string, chain: string): PriceData | undefined {
    return this.priceCache.get(token + '_' + chain);
  }

  public isRunning(): boolean {
    return this.isRunning;
  }

  public getSupportedTokens(): any[] {
    return this.supportedTokens;
  }

  public getSupportedChains(): any[] {
    return this.supportedChains;
  }
} 