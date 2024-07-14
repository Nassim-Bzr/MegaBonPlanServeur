module.exports = app => {
    const commentary = require ("../controllers/commentary.controller.js");
    
var router = require("express").Router();

// Middleware pour vérifier si l'utilisateur est connecté
const checkAuth = (req, res, next) => {
    // Implémentez la logique pour vérifier le token ici
    if (req.user) {
      next();
    } else {
      res.status(401).send({ message: "Non autorisé" });
    }
  };
  
  // Middleware pour vérifier si l'utilisateur est admin
/*   const checkAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send({ message: "Accès refusé" });
    }
  }; */
  
  // Route pour créer un commentaire
  router.post("/", commentary.create);
  
  // Route pour supprimer un commentaire
  router.delete("/:id", commentary.delete);
  
// Create a new Commentary
  router.get("/", commentary.getAllcommentary)

app.use('/api/commentary',router);
}