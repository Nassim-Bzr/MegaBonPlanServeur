// models/bonplan.model.js
module.exports = (sequelize, DataTypes) => {
  const BonPlan = sequelize.define("BonPlan", {
    id_bonplan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lienaffiliation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    datepost: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur'
      }
    },
    id_categorie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorie',
        key: 'id_categorie'
      }
    },
    imglink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    approuvéparadmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    prix_initial: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prix_reduit: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Nouveau champ pour la température
    temperature: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.calculateTemperature();
      }
    },
    // Score de température pour le tri
    temperature_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'bonplan',
    timestamps: false,
    hooks: {
      afterUpdate: (bonplan) => {
        // Recalculer le score de température après chaque update
        bonplan.temperature_score = bonplan.calculateTemperatureScore();
        bonplan.save({ fields: ['temperature_score'] });
      }
    }
  });

  // Méthode pour calculer la température (comme Dealabs)
  BonPlan.prototype.calculateTemperature = function() {
    const likes = this.likes || 0;
    const hoursAge = (new Date() - new Date(this.datepost)) / (1000 * 60 * 60);
    
    if (likes >= 100) return 'BURNING'; // 🔥🔥🔥
    if (likes >= 50) return 'HOT';      // 🔥🔥
    if (likes >= 20) return 'WARM';     // 🔥
    if (likes >= 10) return 'COOL';     // 😐
    if (likes >= 0) return 'COLD';      // ❄️
    return 'FROZEN';                    // 🧊
  };

  // Score pour le tri (prend en compte likes et fraîcheur)
  BonPlan.prototype.calculateTemperatureScore = function() {
    const likes = this.likes || 0;
    const hoursAge = (new Date() - new Date(this.datepost)) / (1000 * 60 * 60);
    
    // Score basé sur les likes avec decay temporel
    const timeDecay = Math.max(0.1, 1 / (1 + hoursAge / 24)); // Decay sur 24h
    return likes * timeDecay;
  };

  BonPlan.associate = (models) => {
    BonPlan.belongsTo(models.utilisateurs, {
      foreignKey: 'id_utilisateur',
      as: 'utilisateur'
    });
    BonPlan.belongsTo(models.categories, {
      foreignKey: 'id_categorie',
      as: 'categorie'
    });
    BonPlan.hasMany(models.commentaires, {
      foreignKey: 'id_bonplan',
      as: 'commentaires'
    });
    BonPlan.hasMany(models.favoris, {
      foreignKey: 'id_bonplan',
      as: 'favoris'
    });
    BonPlan.hasMany(models.likes, {
      foreignKey: 'id_bonplan',
      as: 'likesRelation'
    });
  };

  return BonPlan;
};
