// controllers/favoris.controller.js

const db = require("../models");
const Favoris = db.favoris;

exports.addFavoris = async (req, res) => {
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
          error: err.message  // Fournir plus de détails sur l'erreur
        });
      }
    };

exports.getAllFavoris = async (req, res) => {
    try {
        const favorisList = await Favoris.findAll();
        res.send(favorisList);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Favoris"
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
    try {
        const num = await Favoris.destroy({ where: { ID_Favoris: id } });
        if (num == 1) {
            res.send({ message: "Favoris was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Favoris with id=${id}. Maybe Favoris was not found!` });
        }
    } catch (error) {
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
