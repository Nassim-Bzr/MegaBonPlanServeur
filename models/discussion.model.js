module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define("discussion", {
    id_discussion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false, // Added allowNull constraint
    },
    datecreation: {
      type: DataTypes.DATE,
      allowNull: false, // Added allowNull constraint
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // Added allowNull constraint
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false, // Added allowNull constraint
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