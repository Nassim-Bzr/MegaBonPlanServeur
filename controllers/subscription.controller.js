const db = require("../models");
const Subscription = db.subscriptions;
const User = db.utilisateurs;

// Créer un abonnement par défaut pour un nouvel utilisateur
exports.createDefaultSubscription = async (userId) => {
  try {
    const subscription = await Subscription.create({
      id_utilisateur: userId,
      plan_type: 'FREE',
      posts_limit: 3,
      posts_used_this_month: 0
    });
    return subscription;
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement par défaut:', error);
    throw error;
  }
};

// Obtenir l'abonnement d'un utilisateur
exports.getUserSubscription = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    let subscription = await Subscription.findOne({
      where: { id_utilisateur: userId }
    });

    // Si pas d'abonnement, créer un par défaut
    if (!subscription) {
      subscription = await this.createDefaultSubscription(userId);
    }

    res.json({
      success: true,
      data: {
        plan_type: subscription.plan_type,
        posts_limit: subscription.posts_limit,
        posts_used: subscription.posts_used_this_month,
        remaining_posts: subscription.getRemainingPosts(),
        can_post: subscription.canPost()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'abonnement',
      error: error.message
    });
  }
};

// Upgrade vers Premium (10 posts/mois) - 9.99€
exports.upgradeToPremium = async (req, res) => {
  try {
    const userId = req.body.userId;
    
    let subscription = await Subscription.findOne({
      where: { id_utilisateur: userId }
    });

    if (!subscription) {
      subscription = await this.createDefaultSubscription(userId);
    }

    // Simulation du paiement (tu peux intégrer Stripe ici)
    const paymentSuccess = await processPayment(req.body.paymentData, 9.99);

    if (paymentSuccess) {
      await subscription.update({
        plan_type: 'PREMIUM',
        posts_limit: 10,
        price_paid: 9.99,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        is_active: true
      });

      res.json({
        success: true,
        message: 'Upgrade vers Premium réussi !',
        data: subscription
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Échec du paiement'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upgrade',
      error: error.message
    });
  }
};

// Upgrade vers Premium Plus (50 posts/mois) - 19.99€
exports.upgradeToPremiumPlus = async (req, res) => {
  try {
    const userId = req.body.userId;
    
    let subscription = await Subscription.findOne({
      where: { id_utilisateur: userId }
    });

    if (!subscription) {
      subscription = await this.createDefaultSubscription(userId);
    }

    const paymentSuccess = await processPayment(req.body.paymentData, 19.99);

    if (paymentSuccess) {
      await subscription.update({
        plan_type: 'PREMIUM_PLUS',
        posts_limit: 50,
        price_paid: 19.99,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_active: true
      });

      res.json({
        success: true,
        message: 'Upgrade vers Premium Plus réussi !',
        data: subscription
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Échec du paiement'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upgrade',
      error: error.message
    });
  }
};

// Fonction simulée de paiement (remplace par Stripe/PayPal)
async function processPayment(paymentData, amount) {
  // Simulation - remplace par ta logique de paiement réelle
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Simule un paiement réussi
    }, 1000);
  });
}

// Vérifier si un utilisateur peut poster
exports.canUserPost = async (userId) => {
  try {
    let subscription = await Subscription.findOne({
      where: { id_utilisateur: userId }
    });

    if (!subscription) {
      subscription = await this.createDefaultSubscription(userId);
    }

    return subscription.canPost();
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return false;
  }
};

// Utiliser un post (décrémenter le compteur)
exports.useUserPost = async (userId) => {
  try {
    let subscription = await Subscription.findOne({
      where: { id_utilisateur: userId }
    });

    if (!subscription) {
      subscription = await this.createDefaultSubscription(userId);
    }

    return await subscription.usePost();
  } catch (error) {
    console.error('Erreur lors de l\'utilisation du post:', error);
    throw error;
  }
}; 