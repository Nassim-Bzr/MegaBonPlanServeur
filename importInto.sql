
INSERT INTO Utilisateur (Nom, Email, MotDePasse, DateInscription, isAdmin) VALUES
('John Doe', 'john.doe@example.com', 'hashedpassword', '2023-01-01', FALSE),
('Jane Doe', 'jane.doe@example.com', 'hashedpassword', '2023-01-02', TRUE);


INSERT INTO Categorie (NomCategorie) VALUES
('Électronique'),
('Jeux vidéo');



INSERT INTO BonPlan (Titre, Description, LienAffiliation, DatePost, ID_Utilisateur, ID_Categorie, ApprouvéParAdmin) VALUES
('Promotion MacBook Pro', 'Profitez de 20% de réduction sur les derniers MacBook Pro.', 'http://example.com', '2023-01-03', 1, 1, TRUE),
('Offre spéciale PlayStation 5', 'Obtenez une PlayStation 5 à prix réduit pour une durée limitée.', 'http://example.com', '2023-01-04', 2, 2, FALSE);


INSERT INTO Commentaire (Contenu, DateCommentaire, ID_Utilisateur, ID_BonPlan) VALUES
('Super offre, merci !', '2023-01-05', 1, 1),
('Je recommande, livraison rapide.', '2023-01-06', 2, 2);


INSERT INTO Favori (ID_Utilisateur, ID_BonPlan) VALUES
(1, 1),
(2, 2);


INSERT INTO CodePromo (Code, Description, DateExpiration, ID_Utilisateur, ApprouvéParAdmin) VALUES
('PROMO2023', 'Utilisez ce code pour bénéficier de 15% de remise sur votre commande.', '2023-12-31', 1, TRUE);

INSERT INTO CodePromo (Code, Description, DateExpiration, ID_Utilisateur, ApprouvéParAdmin) VALUES
('SOLDES', 'Code de réduction pour les soldes d''été.', '2023-07-31', 2, TRUE);


INSERT INTO Discussion (Titre, DateCreation, ID_Utilisateur) VALUES
('Conseils pour choisir un nouveau smartphone', '2023-01-07', 1),
('Avis sur les derniers jeux PS5', '2023-01-08', 2);


INSERT INTO Message (Contenu, DateEnvoi, ID_Utilisateur, ID_Discussion) VALUES
('Je pense que le modèle X est un bon choix pour son appareil photo.', '2023-01-09', 1, 1),
('Le jeu Y est incroyable, surtout en mode coop.', '2023-01-10', 2, 2);
