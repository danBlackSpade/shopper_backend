// import express, { Request, Response } from 'express';
// import { RideController } from './controllers/RideController';

// const router = express.Router();


// const rideController= new RideController();


// router.post('/ride/estimate', rideController.estimateRide);

// export default router;

import { Router } from 'express';
import rideRoutes from './routes/ride.routes';
import { estimateRide, confirmRide } from './controllers/ride.controller';
import { asyncHandler } from './utils/asyncHandler';
import User from './models/user.model';

const router = Router();

// rides
// router.use('/ride', rideRoutes);
router.post('/ride/estimate', asyncHandler(estimateRide));
router.patch('/ride/confirm', asyncHandler(confirmRide));


//test
router.get('/', async (req, res) => {
  res.status(200).json({
    users: await User.find()
  });
});

export default router;
