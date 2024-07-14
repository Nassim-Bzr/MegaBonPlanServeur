// controllers/favoris.controller.js

const db = require("../models");
const Favoris = db.favoris;
// controllers/favoris.controller.js

exports.addFavoris = async (req, res) => {
    if (!req.body.id_utilisateur || !req.body.id_bonplan) {
        return res.status(400).send({
            message: "L'ID de l'utilisateur et l'ID du bon plan sont requis."
        });
    }

    try {
        const newFavoris = await Favoris.create({
          id_utilisateur: req.body.id_utilisateur,
          id_bonplan: req.body.id_bonplan
        });
        res.send(newFavoris);
    } catch (err) {
        console.error("Erreur lors de la création du favori:", err);
        res.status(500).send({
          message: "Une erreur est survenue lors de la création du favori.",
          error: err.message
        });
    }
};


// Controllers/favoris.controller.js
exports.getAllFavoris = async (req, res) => {
    try {
        const favoris = await db.favoris.findAll({
            include: [{
                model: db.bonplans,
                as: 'BonPlan',
            }]
        });
        console.log(favoris);
        res.send(favoris.map(fav => ({
            ...fav.BonPlan.get(),
            id_favoris: fav.id_favoris
        })));
    } catch (err) {
        console.error("Erreur lors de la récupération des favoris", err);
        res.status(500).send({
            message: "Erreur lors de la récupération des favoris"
        });
    }
};



exports.removeAllFavoris = async (req, res) => {
    try {
        await Favoris.destroy({ truncate: true });
        res.send({ message: "All favoris were deleted successfully!" });
    } catch (error) {
        res.status(500).send({
            message: "Could not delete all favoris."
        });
    }
};
exports.removeFavoris = async (req, res) => {
    const id = req.params.id;
    console.log("Attempting to delete favori with ID:", id);  // Ajouter un log pour déboguer

    try {
        const num = await Favoris.destroy({ where: { id_favoris: id } });
        if (num == 1) {
            res.send({ message: "Favoris was deleted successfully!" });
        } else {
            console.log("Favoris not found with ID:", id);  // Log pour voir si l'élément n'est pas trouvé
            res.send({ message: `Cannot delete Favoris with id=${id}. Maybe Favoris was not found!` });
        }
    } catch (error) {
        console.error("Error when trying to delete favoris:", error);  // Log pour attraper les erreurs
        res.status(500).send({
            message: "Could not delete Favoris with id=" + id
        });
    }
};


exports.getAllFavorisByUser = async (req, res) => {
    const id_utilisateur = req.params.id;
    try {
        const favorisList = await Favoris.findAll({
            where: { id_utilisateur: id_utilisateur },
            include: ['BonPlan'] // Assurez-vous d'avoir configuré cette relation dans Sequelize
        });
        res.send(favorisList);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Favoris with userID=" + id_utilisateur
        });
    }
};
