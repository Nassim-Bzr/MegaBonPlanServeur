// models/commentaireLike.model.js

module.exports = (sequelize, DataTypes) => {
    const CommentaireLike = sequelize.define("CommentaireLike", {
      id_utilisateur: {
        type: DataTypes.INTEGER,
        references: {
          model: 'utilisateur',
          key: 'id_utilisateur',
        }
      },
      id_commentaire: {
        type: DataTypes.INTEGER,
        references: {
          model: 'commentaire',
          key: 'id_commentaire',
        }
      }
    });
  
    return CommentaireLike;
  };
  