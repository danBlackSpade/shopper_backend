


import { Request, Response } from 'express';
import { calculateDistance } from '../services/googleMaps.service';
import User from '../models/user.model';
import Ride from '../models/ride.model';
import mongoose from 'mongoose';

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
    const allDrivers = await User.find({
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
      role: 'driver'
    })

    console.log('alldrivers',allDrivers)

    const availableDrivers = allDrivers.filter((driver) => {
      if (driver.minMeters && driver.minMeters <= distanceData.distanceValue) {
        return driver.minMeters <= distanceData.distanceValue
      }
    })
    .map((d) => {
      let formattedPrice: string = '';
      if (d.fee) {
        formattedPrice = (d.fee * (distanceData.distanceValue / 1000))
          .toFixed(2)
          .replace('.', ',')
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // thousands separator with points
      }
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
  }
}

export const confirmRide = async (req: Request, res: Response) => {
  try {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
    console.log(req.body, driver._id)
    // Validações
    // if (!userId) {
    //   return res.status(400).json({ message: 'ID Invalid input' });
    // }
    if (!origin || !destination || origin == destination || !customer_id) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
      })
    }

    const selectedDriver = await User.findById(driver._id)
    console.log(selectedDriver)

    if (!selectedDriver || selectedDriver.role !== 'driver') {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Motorista não encontrado'
      })
    } else {
      if (selectedDriver.minMeters && selectedDriver.minMeters > distance) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Quilometragem invakida para o motorista'
        })
      }
    }
    return res.status(200).json({
      success: true,
      description: 'Operação realizada com sucesso',
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value
    })

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Unknown error occurred' })
    }

  }
}
