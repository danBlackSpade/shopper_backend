"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateRide = void 0;
const googleMaps_service_1 = require("../services/googleMaps.service");
const estimateRide = async (req, res) => {
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
        const distanceData = await (0, googleMaps_service_1.calculateDistance)(origin, destination);
        return res.status(200).json({
            message: 'Distance calculated successfully',
            distance: distanceData.distance,
            duration: distanceData.duration,
            distanceData
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
        // res.status(500).json({ error: error.message });
    }
};
exports.estimateRide = estimateRide;
