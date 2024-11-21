
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({});

interface DistanceResult {
  distance: string; // Ex.: "14.5 km"
  distanceValue: number; // Ex.: 14500 (em metros)
  duration: string; // Ex.: "15 mins"
  durationValue: number; // Ex.: 900 (em segundos)
}

export const calculateDistance = async (origin: string, destination: string): Promise<DistanceResult> => {
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
    })

    if (response.data.rows[0].elements[0].status === 'OK') {
      const distance = response.data.rows[0].elements[0].distance;
      const duration = response.data.rows[0].elements[0].duration;

      return {
        distance: distance.text, // Ex.: "14.5 km"
        distanceValue: distance.value, // Ex.: 14500 (em metros)
        duration: duration.text, // Ex.: "15 mins"
        durationValue: duration.value, // Ex.: 900 (em segundos)
      };
    } else {
      throw new Error('Could not calculate the distance between the provided locations.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to calculate distance. Please try again later.' + error);
  }
}