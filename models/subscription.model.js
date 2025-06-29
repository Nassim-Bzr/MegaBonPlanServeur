module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("Subscription", {
    id_subscription: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur'
      }
    },
    plan_type: {
      type: DataTypes.ENUM('FREE', 'PREMIUM', 'PREMIUM_PLUS'),
      allowNull: false,
      defaultValue: 'FREE'
    },
    posts_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3 // FREE: 3, PREMIUM: 10, PREMIUM_PLUS: 50
    },
    posts_used_this_month: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price_paid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0
    },
    last_reset_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    hooks: {
      beforeCreate: (subscription) => {
        // Définir les limites selon le plan
        switch(subscription.plan_type) {
          case 'FREE':
            subscription.posts_limit = 3;
            break;
          case 'PREMIUM':
            subscription.posts_limit = 10;
            break;
          case 'PREMIUM_PLUS':
            subscription.posts_limit = 50;
            break;
        }
      }
    }
  });

  // Méthode pour vérifier si l'utilisateur peut poster
  Subscription.prototype.canPost = function() {
    // Vérifier si on est dans un nouveau mois
    const now = new Date();
    const lastReset = new Date(this.last_reset_date);
    
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      // Nouveau mois, reset le compteur
      this.posts_used_this_month = 0;
      this.last_reset_date = now;
      this.save();
    }
    
    return this.posts_used_this_month < this.posts_limit;
  };

  // Méthode pour utiliser un post
  Subscription.prototype.usePost = function() {
    if (this.canPost()) {
      this.posts_used_this_month += 1;
      return this.save();
    }
    throw new Error('Limite de posts atteinte pour ce mois');
  };

  // Méthode pour obtenir les posts restants
  Subscription.prototype.getRemainingPosts = function() {
    return Math.max(0, this.posts_limit - this.posts_used_this_month);
  };

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.utilisateurs, {
      foreignKey: 'id_utilisateur',
      as: 'utilisateur'
    });
  };

  return Subscription;
}; 