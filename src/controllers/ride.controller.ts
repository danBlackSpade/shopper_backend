


import { Request, Response } from 'express';
import { calculateDistance } from '../services/googleMaps.service';
import Ride from '../models/ride.model';

export const estimateRide = async (req: Request, res: Response) => {
  try {
    const { userId, origin, destination, distance, price, driverId, driverName } = req.body;

    // Validações
    if (!userId || !origin || !destination || origin === destination) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Criação do documento Ride
    // const newRide = new Ride({
    //   userId,
    //   origin,
    //   destination,
    //   distance,
    //   price,
    //   driverId,
    //   driverName,
    // });

    // // Salva no MongoDB
    // const savedRide = await newRide.save();

    const distanceData = await calculateDistance(origin, destination)

    return res.status(200).json({
      message: 'Distance calculated successfully',
      distance: distanceData.distance,
      duration: distanceData.duration,
      distanceData
    })


  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Unknown error occurred' })

    }
    // res.status(500).json({ error: error.message });
  }
};