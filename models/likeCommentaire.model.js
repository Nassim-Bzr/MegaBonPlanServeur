module.exports = (sequelize, DataTypes) => {
  const LikeCommentaire = sequelize.define('LikeCommentaire', {
    id_like: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Utilisateur',
        key: 'id_utilisateur',
      }
    },
    id_commentaire: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Commentaire',
        key: 'id_commentaire',
      }
    },
    date_like: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  });

  LikeCommentaire.associate = (models) => {
    LikeCommentaire.belongsTo(models.Commentaire, {
      foreignKey: 'id_commentaire',
      as: 'commentaire',
    });
    LikeCommentaire.belongsTo(models.Utilisateur, {
      foreignKey: 'id_utilisateur',
      as: 'utilisateur',
    });
  };

  return LikeCommentaire;
};
