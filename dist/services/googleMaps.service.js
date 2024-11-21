"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new google_maps_services_js_1.Client({});
const calculateDistance = async (origin, destination) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            throw new Error('Google Maps API key is not configured.');
        }
        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                key: apiKey,
            },
        });
        if (response.data.rows[0].elements[0].status === 'OK') {
            const distance = response.data.rows[0].elements[0].distance;
            const duration = response.data.rows[0].elements[0].duration;
            return {
                distance: distance.text, // Ex.: "14.5 km"
                distanceValue: distance.value, // Ex.: 14500 (em metros)
                duration: duration.text, // Ex.: "15 mins"
                durationValue: duration.value, // Ex.: 900 (em segundos)
            };
        }
        else {
            throw new Error('Could not calculate the distance between the provided locations.');
        }
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to calculate distance. Please try again later.' + error);
    }
};
exports.calculateDistance = calculateDistance;
