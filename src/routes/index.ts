import { Router } from 'express';
import rideRoutes from './ride.routes';

const router = Router();

router.use('/ride', rideRoutes);

export default router;
