module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define("discussion", {
    id_discussion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur', // nom correct de la table
        key: 'id_utilisateur'
      }
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorie', // nom correct de la table
        key: 'id_categorie'
      }
    },
  },{
    tableName: 'discussion',
    timestamps: false
  });

  return Discussion;
};
