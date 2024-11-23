// import express, { Request, Response } from 'express';
// import { RideController } from './controllers/RideController';

// const router = express.Router();


// const rideController= new RideController();


// router.post('/ride/estimate', rideController.estimateRide);

// export default router;

import { Router } from 'express';
import { estimateRide, confirmRide, getCustomerRides } from './controllers/ride.controller';
import { asyncHandler } from './utils/asyncHandler';
import User from './models/user.model';
import UserController from './controllers/user.controller';

const router = Router();

// rides
// router.use('/ride', rideRoutes);
router.post('/ride/estimate', asyncHandler(estimateRide));
router.patch('/ride/confirm', asyncHandler(confirmRide));
router.get('/ride/:customer_id/:driver_id?', asyncHandler(getCustomerRides));
router.post('/user/create', asyncHandler(UserController.create));
router.get('/users', asyncHandler(UserController.getAll));
router.get('/drivers', asyncHandler(UserController.getDrivers));


// test
router.get('/', async (req, res) => {
  res.status(200).json({
    users: await User.find()
  });
});

export default router;
