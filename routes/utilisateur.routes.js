const express = require('express');
const router = express.Router();
const utilisateurs = require("../controllers/utilisateur.controller.js");

// Créer un nouvel utilisateur
router.post('/', utilisateurs.create);

// Récupérer tous les utilisateurs
router.get('/', utilisateurs.findAll);

// Récupérer un utilisateur par son ID
router.get('/:id', utilisateurs.findOne);

// Mettre à jour un utilisateur par son ID
router.put('/:id', utilisateurs.update);

// Supprimer un utilisateur par son ID
router.delete('/:id', utilisateurs.delete);

// Supprimer tous les utilisateurs
router.delete("/", utilisateurs.deleteAll);

// Route de connexion
router.post('/login', utilisateurs.login);

// Route de vérification
router.post('/verify', utilisateurs.verifyUser);

module.exports = router;
