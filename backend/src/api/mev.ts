/**
 * MEV Protection API
 * 
 * Provides endpoints for Maximum Extractable Value (MEV) protection services
 * including risk analysis, protection strategies, and cross-chain recommendations.
 * 
 * @version 1.0.0
 * @author TAO Magnet Bot Team
 */

import express from 'express';
import { MEVProtector } from '../mev/protection';

const router = express.Router();
const mevProtector = new MEVProtector();

/**
 * GET /api/v1/mev/status
 * 
 * Retrieves current MEV protection system status and configuration.
 * 
 * @returns {Object} MEV protection status including:
 * - ethereum: Current Ethereum network protection metrics
 * - solana: Current Solana network protection metrics  
 * - bittensor: Current Bittensor network protection metrics
 * - timestamp: Current system timestamp
 */
router.get('/status', (_req, res) => {
  try {
    const status = mevProtector.getStatus();
    return res.json({
      ...status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'MEV protection status unavailable' });
  }
});

/**
 * POST /api/v1/mev/analyze
 * 
 * Analyzes arbitrage opportunities for MEV risk and provides protection recommendations.
 * 
 * @param {Object} body - Arbitrage opportunity data
 * @param {string} body.sourceChain - Origin blockchain network
 * @param {string} body.targetChain - Destination blockchain network
 * @param {number} body.estimatedProfit - Expected profit in USD
 * @param {number} body.percentageDifference - Price difference percentage
 * @param {string} [body.timestamp] - Opportunity timestamp (optional)
 * 
 * @returns {Object} Analysis results including:
 * - opportunity: Processed opportunity data
 * - protection: Recommended protection parameters
 * - recommendation: Executive summary of protection strategy
 */
router.post('/analyze', (req, res) => {
  try {
    const { sourceChain, targetChain, estimatedProfit, percentageDifference, timestamp } = req.body;
    
    const opportunity = {
      sourceChain,
      targetChain,
      estimatedProfit: parseFloat(estimatedProfit) || 0,
      percentageDifference: parseFloat(percentageDifference) || 0,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    };

    const protection = mevProtector.getProtection(opportunity);
    
    return res.json({
      opportunity,
      protection,
      recommendation: protection.reason
    });
  } catch (error) {
    return res.status(500).json({ error: 'MEV analysis failed' });
  }
});

/**
 * GET /api/v1/mev/chains
 * 
 * Retrieves MEV protection capabilities and recommendations for all supported chains.
 * 
 * @returns {Array} Array of chain-specific protection information including:
 * - chain: Blockchain network identifier
 * - protectionLevel: Current protection strength
 * - gasMultiplier: Recommended gas price multiplier
 * - delayMs: Recommended execution delay
 * - capabilities: Available protection features
 * - notes: Implementation details and limitations
 */
router.get('/chains', (_req, res) => {
  try {
    const chains = ['ethereum', 'solana', 'bittensor'];
    const recommendations = chains.map(chain => ({
      chain,
      ...mevProtector.getChainRecommendations(chain)
    }));
    
    return res.json(recommendations);
  } catch (error) {
    return res.status(500).json({ error: 'Chain recommendations unavailable' });
  }
});

/**
 * POST /api/v1/mev/apply-protection
 * 
 * Applies timing-based MEV protection by introducing strategic execution delays.
 * Used for demonstration and testing of protection mechanisms.
 * 
 * @param {Object} body - Protection parameters
 * @param {number} body.delayMs - Delay duration in milliseconds (max 30000)
 * 
 * @returns {Object} Protection application results including:
 * - requestedDelay: Requested delay duration
 * - actualDelay: Actual delay duration applied
 * - success: Operation success status
 */
router.post('/apply-protection', async (req, res) => {
  try {
    const { delayMs } = req.body;
    const delay = parseInt(delayMs) || 0;
    
    if (delay > 30000) {
      return res.status(400).json({ error: 'Delay exceeds maximum allowed duration (30s)' });
    }
    
    const startTime = Date.now();
    await mevProtector.applyDelay(delay);
    const actualDelay = Date.now() - startTime;
    
    return res.json({
      requestedDelay: delay,
      actualDelay,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ error: 'MEV protection application failed' });
  }
});

export default router; 