// models/like.model.js

module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
      id_like: {
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
      id_bonplan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'bonplan',
          key: 'id_bonplan'
        }
      }
    }, {
      tableName: 'Likes',
      timestamps: true
    });
  
    return Like;
  };
  