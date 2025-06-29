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
        model: 'utilisateur',
        key: 'id_utilisateur'
      }
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorie',
        key: 'id_categorie'
      }
    },
  },{
    tableName: 'discussion',
    timestamps: false
  });

  Discussion.associate = (models) => {
    Discussion.belongsTo(models.utilisateurs, {
      foreignKey: 'id_utilisateur',
      as: 'utilisateur'
    });
    Discussion.belongsTo(models.categories, {
      foreignKey: 'id_category',
      as: 'categorie'
    });
  };

  return Discussion;
};
