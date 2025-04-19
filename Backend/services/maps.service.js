const axios = require('axios');
const captainModel = require('../models/captain.model');

// Nominatim Base URL
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
// OpenRouteService Base URL
const ORS_URL = 'https://api.openrouteservice.org';

// Replace with your OpenRouteService API key
const ORS_API_KEY = process.env.OPENROUTESERVICE_API;

module.exports.getCoordinates = async (address) => {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                ltd: parseFloat(location.lat),
                lng: parseFloat(location.lon),
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAddressCoordinate = async (city) => {
    const geocodeUrl = `https://api.openrouteservice.org/geocode/search`;
    const response = await axios.get(geocodeUrl, {
        params: {
            api_key: process.env.OPENROUTESERVICE_API,
            text: city,
        },
    });
    const coordinates = response.data.features[0]?.geometry.coordinates;
    if (!coordinates) {
        throw new Error(`Could not find coordinates for ${city}`);
    }
    return coordinates;
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const [originCoords, destinationCoords] = await Promise.all([
        getAddressCoordinate(origin),
        getAddressCoordinate(destination),
    ]);

    const url = `${ORS_URL}/v2/matrix/driving-car`;

    try {
        const response = await axios.post(
            url,
            {
                locations: [originCoords, destinationCoords],
                metrics: ['distance', 'duration'],
            },
            {
                headers: {
                    Authorization: ORS_API_KEY,
                },
            }
        );

        const { distances, durations } = response.data;

        const distanceInMeters = distances[0][1];
        const durationInSeconds = durations[0][1];

        // Convert distance to kilometers
        const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

        // Convert duration to hours
        const durationInHours = (durationInSeconds / 3600).toFixed(2);

        return {
           distance: {
                kilometers: distanceInKilometers,
                meters: distanceInMeters,
            },
            duration: {
                hours: durationInHours,
                seconds: durationInSeconds,
            },
        };
    } catch (err) {
        if (err.response) {
            console.error('API Error:', err.response.data);
        }
        throw err;
    }
};


module.exports.getAutoCompleteSuggestions = async (input) => {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            return response.data
                .map((entry) => entry.display_name)
                .filter((value) => value);
        } else {
            return []; // Return an empty array if no suggestions found
        }
    } catch (err) {
        console.error('Error fetching autocomplete suggestions:', err);
        if (err.response) {
            throw new Error(`API error: ${err.response.status} - ${err.response.data}`);
        } else if (err.request) {
            throw new Error('No response received from the server');
        } else {
            throw new Error(`Error setting up the request: ${err.message}`);
        }
    }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // Radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371],
            },
        },
    });

    return captains;
};
