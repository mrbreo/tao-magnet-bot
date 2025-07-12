import { Router } from 'express';
import { HoldingsAllocation } from '../../../shared/types/holdings';

const router = Router();

// GET /api/v1/wallet/holdings
router.get('/holdings', (req, res) => {
  // TODO: Fetch holdings allocation
  const holdings: HoldingsAllocation = {
    taoBalance: 0,
    bittensor: 0,
    ethereum: 0,
    solana: 0,
    allocation: { bittensor: 0, ethereum: 0, solana: 0 }
  };
  res.json(holdings);
});

// POST /api/v1/wallet/allocate
router.post('/allocate', (req, res) => {
  // TODO: Trigger allocation rebalance
  const { allocation } = req.body;
  res.json({ success: true });
});

export default router; 