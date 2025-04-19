const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/maps.controller');
const { query , validationResult } = require('express-validator');

// Route to get coordinates from an address
router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getCoordinates
);

// Route to get distance and travel time between two locations
router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getDistanceTime
);

// Route to get autocomplete suggestions for location input
router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

module.exports = router;
