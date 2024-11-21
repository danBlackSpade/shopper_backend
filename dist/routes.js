"use strict";
// import express, { Request, Response } from 'express';
// import { RideController } from './controllers/RideController';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// const rideController= new RideController();
// router.post('/ride/estimate', rideController.estimateRide);
// export default router;
const express_1 = require("express");
const ride_rotes_1 = __importDefault(require("./routes/ride.rotes"));
const ride_controller_1 = require("./controllers/ride.controller");
const asyncHandler_1 = require("./utils/asyncHandler");
const router = (0, express_1.Router)();
router.use('/ride', ride_rotes_1.default);
router.post('/ride/estimate', (0, asyncHandler_1.asyncHandler)(ride_controller_1.estimateRide));
//test
router.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
exports.default = router;
