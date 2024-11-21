


import { Request, Response } from 'express';
import { calculateDistance } from '../services/googleMaps.service';
import Driver from '../models/driver.model';
import Ride from '../models/ride.model';

export const estimateRide = async (req: Request, res: Response) => {
  try {
    const { userId, origin, destination, distance, price, driverId, driverName } = req.body;

    // Validações
    if (!userId || !origin || !destination || origin === destination) {
      return res.status(400).json({ 
        error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
        error_code: 'INVALID_DATA'
      });
    }

    const distanceData = await calculateDistance(origin, destination)
    const allDrivers = await Driver.find({
      // available: true,
      // location: {
      //   $near: {
      //     $geometry: {
      //       type: 'Point',
      //       coordinates: [destination.longitude, destination.latitude],
      //     },
      //     $maxDistance: 50000, // 50km
      //   },
      // },
    })

    console.log('alldrivers',allDrivers)
    

    const availableDrivers = allDrivers.filter((driver) => {
      return driver.minMeters <= distanceData.distanceValue
    })
    .map((d) => {
      const formattedPrice = (d.fee * (distanceData.distanceValue / 1000))
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // thousands separator with points

      console.log('Formatted Price:', formattedPrice);

      // console.log(driver)
      return {
        id: d.id,
        name: d.name,
        description: d.description,
        car: d.car,
        rating: d.rating,
        price: formattedPrice,
        // fee: d.fee,
        // minKm: d.minKm,
      }
    })
    .sort((a, b) => {
      return parseFloat(a.price.replace('.', '').replace(',', '.')) - parseFloat(b.price.replace('.', '').replace(',', '.'))
    })

    return res.status(200).json({
      message: 'Operação realizada com sucesso',
      startCoordinates: {
        latitude: origin.latitude,
        longitude: origin.logitude
      },
      endCoordinates: {
        latitude: destination.latitude,
        longitude: destination.longitude
      },
      distance: distanceData.distance,
      duration: distanceData.duration,
      availableDrivers: availableDrivers,
      googleResp: distanceData
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