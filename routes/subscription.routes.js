module.exports = app => {
  const subscription = require("../controllers/subscription.controller.js");
  
  var router = require("express").Router();

  // Récupérer l'abonnement d'un utilisateur
  router.get("/user/:userId", subscription.getUserSubscription);

  // Upgrade vers Premium (10 posts/mois - 9.99€)
  router.post("/upgrade/premium", subscription.upgradeToPremium);

  // Upgrade vers Premium Plus (50 posts/mois - 19.99€)
  router.post("/upgrade/premium-plus", subscription.upgradeToPremiumPlus);

  app.use('/api/subscriptions', router);
}; 