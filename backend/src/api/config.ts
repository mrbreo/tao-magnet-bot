import { Router } from 'express';
import { ConfigSettings } from '../../../shared/types/config';

const router = Router();

// GET /api/v1/config
router.get('/', (req, res) => {
  // TODO: Fetch config settings
  const config: ConfigSettings = {
    minGainThreshold: 10,
    opportunityPriority: { timeWeight: 50, gainWeight: 50 },
    bridgePreference: 'best',
    executionMode: 'auto'
  };
  res.json(config);
});

// PUT /api/v1/config
router.put('/', (req, res) => {
  // TODO: Update config settings
  const config: ConfigSettings = req.body;
  res.json({ success: true });
});

export default router; 