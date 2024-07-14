module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define("discussion", {
    id_discussion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
<<<<<<< HEAD
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
=======
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
>>>>>>> e352006c5987d7ae78cab48be8a552a669ab9935
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

  return Discussion;
};