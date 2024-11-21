import { Router } from 'express';
import rideRoutes from './ride.rotes';

const router = Router();

router.use('/ride', rideRoutes);

export default router;
