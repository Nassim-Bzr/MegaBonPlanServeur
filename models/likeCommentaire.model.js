// models/likeCommentaire.model.js

module.exports = (sequelize, DataTypes) => {
    const LikeCommentaire = sequelize.define("LikeCommentaire", {
      id_like: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_commentaire: {
        type: DataTypes.INTEGER,
        references: {
          model: 'commentaire',
          key: 'id_commentaire',
        }
      },
      id_utilisateur: {
        type: DataTypes.INTEGER,
        references: {
          model: 'utilisateur',
          key: 'id_utilisateur',
        }
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
  