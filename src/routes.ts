// import express, { Request, Response } from 'express';
// import { RideController } from './controllers/RideController';

// const router = express.Router();


// const rideController= new RideController();


// router.post('/ride/estimate', rideController.estimateRide);

// export default router;

import { Router } from 'express';
import rideRoutes from './routes/ride';
import { estimateRide } from './controllers/RideController';
import { asyncHandler } from './utils/asyncHandler';

const router = Router();

router.use('/ride', rideRoutes);
router.post('/ride/estimate', asyncHandler(estimateRide));


//test
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

export default router;
