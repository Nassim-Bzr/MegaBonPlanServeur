const auth = require('../middleware/auth.middleware');
// utilisateurs routes

module.exports = app => {
  const utilisateurs = require("../controllers/utilisateur.controller.js");

  var router = require("express").Router();

  // Créer un nouvel utilisateur


  // Récupérer tous les utilisateurs
  router.post('/', utilisateurs.create);
router.get('/', utilisateurs.findAll);
router.get('/:id', utilisateurs.findOne);
router.put('/:id', utilisateurs.update);
router.delete('/:id', utilisateurs.delete);
  router.get("/", utilisateurs.findAll);
// Route de connexion
router.delete("/", utilisateurs.deleteAll);
router.post('/login', utilisateurs.login);


  // Récupérer un utilisateur par son ID
 

  app.use('/api/utilisateur', router);
}