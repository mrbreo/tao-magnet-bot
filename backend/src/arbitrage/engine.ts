import { EventEmitter } from 'events';
import { logger } from '../core/logger';
import { PriceAggregator } from '../price/aggregator';
import { ExecutionEngine } from '../execution/engine';
import { RiskManager } from '../risk/manager';
import { ArbitrageOpportunity, TokenInfo, ChainInfo, TradeDecision } from '../../shared/types';

export class ArbitrageEngine extends EventEmitter {
  private priceAggregator: PriceAggregator;
  private executionEngine: ExecutionEngine;
  private riskManager: RiskManager;
  private isRunning: boolean = false;
  private opportunities: Map<string, ArbitrageOpportunity> = new Map();
  private minProfitThreshold: number;
  private maxSlippage: number;
  private gasPriceMultiplier: number;

  constructor() {
    super();
    this.priceAggregator = new PriceAggregator();
    this.executionEngine = new ExecutionEngine();
    this.riskManager = new RiskManager();
    
    // Configuration from environment variables
    this.minProfitThreshold = parseFloat(process.env.MIN_PROFIT_THRESHOLD || '10'); // $10 minimum profit
    this.maxSlippage = parseFloat(process.env.MAX_SLIPPAGE || '0.5'); // 0.5% max slippage
    this.gasPriceMultiplier = parseFloat(process.env.GAS_PRICE_MULTIPLIER || '1.1'); // 10% gas price buffer
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Arbitrage engine is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting arbitrage engine');

    // Subscribe to price updates
    this.priceAggregator.on('priceUpdate', this.handlePriceUpdate.bind(this));
    
    // Subscribe to execution results
    this.executionEngine.on('executionResult', this.handleExecutionResult.bind(this));

    // Start monitoring for opportunities
    this.startOpportunityMonitoring();

    logger.info('Arbitrage engine started successfully');
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    logger.info('Stopping arbitrage engine');
    
    // Clean up event listeners
    this.priceAggregator.removeAllListeners();
    this.executionEngine.removeAllListeners();
    
    logger.info('Arbitrage engine stopped');
  }

  private async handlePriceUpdate(priceData: any): Promise<void> {
    if (!this.isRunning) return;

    try {
      const opportunities = await this.identifyOpportunities(priceData);
      
      for (const opportunity of opportunities) {
        if (this.shouldExecuteOpportunity(opportunity)) {
          await this.executeOpportunity(opportunity);
        }
      }
    } catch (error) {
      logger.error('Error handling price update:', error);
    }
  }

  private async identifyOpportunities(priceData: any): Promise<ArbitrageOpportunity[]> {
    const opportunities: ArbitrageOpportunity[] = [];

    // Check TAO opportunities across chains
    const taoOpportunities = this.findTAOOpportunities(priceData);
    opportunities.push(...taoOpportunities);

    // Check subnet alpha token opportunities
    const alphaOpportunities = this.findAlphaTokenOpportunities(priceData);
    opportunities.push(...alphaOpportunities);

    return opportunities;
  }

  private findTAOOpportunities(priceData: any): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];
    const taoPrices = priceData.tao || {};

    // Compare TAO prices across different chains
    const chains = Object.keys(taoPrices);
    
    for (let i = 0; i < chains.length; i++) {
      for (let j = i + 1; j < chains.length; j++) {
        const chain1 = chains[i];
        const chain2 = chains[j];
        const price1 = taoPrices[chain1];
        const price2 = taoPrices[chain2];

        if (price1 && price2) {
          const priceDiff = Math.abs(price1 - price2);
          const percentageDiff = (priceDiff / Math.min(price1, price2)) * 100;

          if (percentageDiff > 0.5) { // 0.5% minimum difference
            const opportunity: ArbitrageOpportunity = {
              id: `tao_${chain1}_${chain2}_${Date.now()}`,
              token: 'TAO',
              sourceChain: price1 < price2 ? chain1 : chain2,
              targetChain: price1 < price2 ? chain2 : chain1,
              sourcePrice: Math.min(price1, price2),
              targetPrice: Math.max(price1, price2),
              priceDifference: priceDiff,
              percentageDifference: percentageDiff,
              estimatedProfit: this.calculateEstimatedProfit(price1, price2),
              estimatedFees: this.estimateFees(chain1, chain2),
              riskScore: this.calculateRiskScore(chain1, chain2),
              timestamp: new Date(),
              status: 'pending'
            };

            opportunities.push(opportunity);
          }
        }
      }
    }

    return opportunities;
  }

  private findAlphaTokenOpportunities(priceData: any): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];
    const alphaTokens = priceData.alphaTokens || {};

    // Check each subnet's alpha token
    for (const [subnetId, tokenData] of Object.entries(alphaTokens)) {
      const subnetPrices = tokenData as any;
      const chains = Object.keys(subnetPrices);

      for (let i = 0; i < chains.length; i++) {
        for (let j = i + 1; j < chains.length; j++) {
          const chain1 = chains[i];
          const chain2 = chains[j];
          const price1 = subnetPrices[chain1];
          const price2 = subnetPrices[chain2];

          if (price1 && price2) {
            const priceDiff = Math.abs(price1 - price2);
            const percentageDiff = (priceDiff / Math.min(price1, price2)) * 100;

            if (percentageDiff > 1.0) { // 1% minimum difference for alpha tokens
              const opportunity: ArbitrageOpportunity = {
                id: `alpha_${subnetId}_${chain1}_${chain2}_${Date.now()}`,
                token: `ALPHA_${subnetId}`,
                sourceChain: price1 < price2 ? chain1 : chain2,
                targetChain: price1 < price2 ? chain2 : chain1,
                sourcePrice: Math.min(price1, price2),
                targetPrice: Math.max(price1, price2),
                priceDifference: priceDiff,
                percentageDifference: percentageDiff,
                estimatedProfit: this.calculateEstimatedProfit(price1, price2),
                estimatedFees: this.estimateFees(chain1, chain2),
                riskScore: this.calculateRiskScore(chain1, chain2),
                timestamp: new Date(),
                status: 'pending'
              };

              opportunities.push(opportunity);
            }
          }
        }
      }
    }

    return opportunities;
  }

  private calculateEstimatedProfit(sourcePrice: number, targetPrice: number): number {
    // Calculate profit after fees and slippage
    const priceDiff = targetPrice - sourcePrice;
    const estimatedFees = this.estimateFees('source', 'target');
    const slippageLoss = (targetPrice * this.maxSlippage) / 100;
    
    return priceDiff - estimatedFees - slippageLoss;
  }

  private estimateFees(sourceChain: string, targetChain: string): number {
    // Estimate gas fees for cross-chain transfer
    const baseFees = {
      'bittensor': 0.001, // TAO
      'ethereum': 0.005,  // ETH
      'solana': 0.0001    // SOL
    };

    const sourceFee = baseFees[sourceChain as keyof typeof baseFees] || 0.001;
    const targetFee = baseFees[targetChain as keyof typeof baseFees] || 0.001;
    
    return sourceFee + targetFee;
  }

  private calculateRiskScore(sourceChain: string, targetChain: string): number {
    // Calculate risk score based on chain reliability, liquidity, etc.
    const chainRiskScores = {
      'bittensor': 0.1,
      'ethereum': 0.2,
      'solana': 0.3
    };

    const sourceRisk = chainRiskScores[sourceChain as keyof typeof chainRiskScores] || 0.5;
    const targetRisk = chainRiskScores[targetChain as keyof typeof chainRiskScores] || 0.5;
    
    return (sourceRisk + targetRisk) / 2;
  }

  private shouldExecuteOpportunity(opportunity: ArbitrageOpportunity): boolean {
    // Check if opportunity meets criteria for execution
    const minProfit = this.minProfitThreshold;
    const maxRisk = 0.7; // Maximum acceptable risk score

    return (
      opportunity.estimatedProfit >= minProfit &&
      opportunity.riskScore <= maxRisk &&
      opportunity.percentageDifference >= 0.5
    );
  }

  private async executeOpportunity(opportunity: ArbitrageOpportunity): Promise<void> {
    try {
      logger.info(`Executing arbitrage opportunity: ${opportunity.id}`, {
        profit: opportunity.estimatedProfit,
        percentage: opportunity.percentageDifference
      });

      // Update opportunity status
      opportunity.status = 'executing';
      this.opportunities.set(opportunity.id, opportunity);

      // Emit opportunity for frontend
      this.emit('opportunityFound', opportunity);

      // Execute the trade
      const result = await this.executionEngine.executeTrade(opportunity);
      
      if (result.success) {
        opportunity.status = 'completed';
        logger.info(`Arbitrage completed successfully: ${opportunity.id}`, {
          actualProfit: result.actualProfit,
          executionTime: result.executionTime
        });
      } else {
        opportunity.status = 'failed';
        logger.error(`Arbitrage failed: ${opportunity.id}`, {
          error: result.error
        });
      }

      this.opportunities.set(opportunity.id, opportunity);
      this.emit('opportunityUpdated', opportunity);

    } catch (error) {
      logger.error(`Error executing opportunity ${opportunity.id}:`, error);
      opportunity.status = 'failed';
      this.opportunities.set(opportunity.id, opportunity);
      this.emit('opportunityUpdated', opportunity);
    }
  }

  private async handleExecutionResult(result: any): Promise<void> {
    // Handle execution results and update opportunities
    logger.info('Execution result received:', result);
  }

  private startOpportunityMonitoring(): void {
    // Monitor opportunities and clean up old ones
    setInterval(() => {
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes

      for (const [id, opportunity] of this.opportunities) {
        if (now - opportunity.timestamp.getTime() > maxAge) {
          this.opportunities.delete(id);
        }
      }
    }, 60000); // Check every minute
  }

  // Public methods for external access
  public getOpportunities(): ArbitrageOpportunity[] {
    return Array.from(this.opportunities.values());
  }

  public getOpportunity(id: string): ArbitrageOpportunity | undefined {
    return this.opportunities.get(id);
  }

  public isRunning(): boolean {
    return this.isRunning;
  }

  public updateConfiguration(config: {
    minProfitThreshold?: number;
    maxSlippage?: number;
    gasPriceMultiplier?: number;
  }): void {
    if (config.minProfitThreshold !== undefined) {
      this.minProfitThreshold = config.minProfitThreshold;
    }
    if (config.maxSlippage !== undefined) {
      this.maxSlippage = config.maxSlippage;
    }
    if (config.gasPriceMultiplier !== undefined) {
      this.gasPriceMultiplier = config.gasPriceMultiplier;
    }

    logger.info('Arbitrage engine configuration updated:', config);
  }
} 