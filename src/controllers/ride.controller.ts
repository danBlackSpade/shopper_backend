


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
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // thousands with points
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
    // console.log(req.body, driver._id)
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
    // console.log(selectedDriver)

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


    const newRide = new Ride({
      origin,
      destination,
      distance,
      duration,
      value: value,
      driverId: driver._id,
      driverName: driver.name,
      customerId: customer_id,
      status: 'confirmed'
      // driver_id: selectedDriver._id,
      // driver_name: selectedDriver.name,
      // driver_description: selectedDriver.description,
      // driver_car: selectedDriver.car,
      // driver_rating: selectedDriver.rating,
      // driver_fee: selectedDriver.fee,
      // driver_minMeters: selectedDriver.minMeters,
      // value: value
    })
    
    // save Ride
    
    await newRide.save().catch((err) => {
      console.error('Error saving ride:', err)
      return res.status(500).json({
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'Erro ao salvar a viagem'
      })
    })
    console.log(Ride.find())


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

export const getCustomerRides = async (req: Request, res: Response) => {
  
// ● O id do usuário não pode estar em branco. 
// ● Se um id de motorista for informado, ele precisa ser um id válido. 
 
// Após as validações ele: 
// ● Buscar as viagens realizadas pelo usuário, ordenando da mais 
// recente para a mais antiga. 
// ● Pode receber um query parameter “driver_id” que, se informado, 
// deve filtrar apenas as viagens realizadas pelo usuário com este 
// motorista. 

// Ela irá retornar: 
// ● Uma lista com as viagens realizadas. 
  try {
    const { customer_id, driver_id } = req.params;
    // const customer_id = req.params.customer_id
    // const driver_id = req.query.driver_id
    const customer = await User.findById(customer_id)

    if (!customer_id || customer_id === '' || !customer) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'ID  user inválido'
      })
    }
    
    const driver = await User.findById(driver_id)
    console.log(driver)
    if (!driver && driver_id) {
      return res.status(400).json({
        error_code: 'INVALID_DRIVER',
        error_description: 'Motorista inválido'
      })
    } 

    const filters: any = { customerId: customer_id }
    if (driver_id) {
      filters.driverId = driver_id
    }


    const rides = await Ride.find(filters).sort({ createdAt: -1 })
    const renamedRides = rides.map(function(r) {
      return {
        id: r._id,
        date: r.createdAt,
        origin: r.origin,
        destination: r.destination,
        distance: r.distance,
        duration: r.duration,
        value: r.value,
        driver: {
          id: r.driverId,
          name: r.driverName
        }
      }
    })

    if (renamedRides.length === 0) {
      return res.status(404).json({
        error_code: 'NO_RIDES_FOUND',
        error_description: 'Nenhum registro encontrado'
      })
    }

    return res.status(200).json({
      description: 'Operação realizada com sucesso',
      customer_id,
      rides: renamedRides
    });


  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Unknown error occurred' })
    }
  }
}
