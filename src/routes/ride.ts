import { Router } from 'express';
import { estimateRide } from '../controllers/RideController';

const router = Router();

// POST /ride/estimate
// router.post('/estimate', estimateRide);
router.get('/test', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

export default router;
