// bonplan.model.js

module.exports = (sequelize, DataTypes) => {
    const BonPlan = sequelize.define("BonPlan", {
      ID_BonPlan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_bonplan' // Assurez-vous que le nom de champ correspond exactement à celui dans votre base de données
      },
      Titre: {
        type: DataTypes.STRING,
        field: 'titre', // Assurez-vous que le nom de champ correspond exactement à celui dans votre base de données
        allowNull: false // Cette ligne s'assure que le champ Titre ne peut pas être null
      },
      Description: {
        type: DataTypes.TEXT,
        field: 'description', // Assurez-vous que le nom de champ correspond exactement à celui dans votre base de données
      },
      LienAffiliation: {
        type: DataTypes.STRING,
        field: 'lienaffiliation', // Assurez-vous que le nom de champ correspond exactement à celui dans votre base de données
      },
      DatePost: {
        type: DataTypes.DATE,
        field: 'datepost', // Assurez-vous que le nom de champ correspond exactement à celui dans votre base de données
      },
      ID_Utilisateur: {
        type: DataTypes.INTEGER,
        field: 'id_utilisateur' // Assurez-vous que cette clé étrangère correspond à la colonne dans votre base de données
      },
      ID_Categorie: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categorie', // nom du modèle référencé
          key: 'id_categorie', // clé dans le modèle référencé
        },
        field: 'id_categorie' // le nom exact de la colonne dans la table BonPlan
      },
      
      imglink: {
        type: DataTypes.STRING,
        field: 'imglink', // Assurez-vous que le nom de champ correspond à la base de données
        allowNull: true // Permettre que ce champ soit null puisqu'il s'agira d'un lien URL facultatif
      },
      
      ApprouveParAdmin: {
        type: DataTypes.BOOLEAN,
        field: 'approuvéparadmin', // Assurez-vous que le nom de champ correspond exactement à celui dans votre base de données. PostgreSQL est sensible à la casse, donc assurez-vous que la casse correspond.
        defaultValue: false // Définissez une valeur par défaut si nécessaire
      },
    }, {
      tableName: 'bonplan', // Assurez-vous que le nom de la table est correct et correspond à la casse exacte de votre table dans PostgreSQL
      timestamps: false, // Si votre table n'inclut pas les champs 'createdAt' et 'updatedAt', assurez-vous que cette option est réglée sur false
      freezeTableName: true // Empêche Sequelize de modifier le nom de la table
    });
  
    return BonPlan;
  };
  