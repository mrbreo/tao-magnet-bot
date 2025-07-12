import { Router } from 'express';
import { TradeOpportunity } from '../../../shared/types/trade';
import { ExecutionLogEntry } from '../../../shared/types/executionLog';

const router = Router();

// GET /api/v1/arbitrage/best-trades
router.get('/best-trades', (req, res) => {
  // TODO: Fetch best trade opportunities
  const bestTrades: TradeOpportunity[] = [];
  res.json(bestTrades);
});

// POST /api/v1/arbitrage/execute
router.post('/execute', (req, res) => {
  // TODO: Execute trade by opportunityId
  const { opportunityId } = req.body;
  res.json({ success: true });
});

// GET /api/v1/arbitrage/execution-log
router.get('/execution-log', (req, res) => {
  // TODO: Fetch execution log
  const log: ExecutionLogEntry[] = [];
  res.json(log);
});

export default router; 