// discussion.model.js

module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define("discussion", {
    id_discussion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
    },
    datecreation: {
      type: DataTypes.DATE,
    },
    content: {
      type: DataTypes.TEXT, // Changed to TEXT to match long content type
    },
    likes: {
      type: DataTypes.INTEGER, // Corrected the type for likes
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },{
    tableName: 'discussion',
    timestamps: false
  });

  return Discussion;
};
