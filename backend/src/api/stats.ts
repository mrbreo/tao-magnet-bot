import { Router } from 'express';
import { TAOGainPoint, StatsMetrics } from '../../../shared/types/stats';

const router = Router();

// GET /api/v1/stats/tao-gain
router.get('/tao-gain', (req, res) => {
  // TODO: Fetch TAO gain points
  const gain: TAOGainPoint[] = [];
  res.json(gain);
});

// GET /api/v1/stats/metrics
router.get('/metrics', (req, res) => {
  // TODO: Fetch stats metrics
  const metrics: StatsMetrics = {
    totalTAONetted: 0,
    tradesExecuted: 0,
    avgDetectionLatency: 0,
    successRate: 0,
    avgBridgeLatency: 0
  };
  res.json(metrics);
});

export default router; 