// routes/favoris.routes.js

const express = require('express');
const router = express.Router();
const favorisController = require("../controllers/favoris.controller");

// Create a new favoris




router.post('/', favorisController.addFavoris);

// Get all favoris
router.get('/', favorisController.getAllFavoris);

// Get a favoris by its ID
router.get('/:id', favorisController.getAllFavorisByUser);

// Update a favoris by its ID


// Delete a favoris by its ID
router.delete('/:id', favorisController.removeFavoris);
router.delete('/', favorisController.removeAllFavoris);



module.exports = app => {
    app.use('/api/favoris', router);
};

