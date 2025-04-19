const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');

// Controller to get coordinates from an address
exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getCoordinates(address);
        return res.status(200).json({ success: true, data: coordinates });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get distance and travel time between two locations
exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    try {
        const result = await mapService.getDistanceTime(origin, destination);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get autocomplete suggestions
exports.getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    try {
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        return res.status(200).json({ success: true, data: suggestions });
    } catch (error) {
        console.error('Error in getAutoCompleteSuggestions:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return res.status(error.response.status).json({ 
                success: false, 
                message: 'Error from map service', 
                error: error.response.data 
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(503).json({ 
                success: false, 
                message: 'No response from map service' 
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return res.status(500).json({ 
                success: false, 
                message: 'Error setting up request to map service', 
                error: error.message 
            });
        }
    }
};

