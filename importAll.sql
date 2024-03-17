CREATE TABLE Utilisateur (
    ID_Utilisateur SERIAL PRIMARY KEY,
    Nom VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    MotDePasse VARCHAR(255),
    DateInscription DATE,
    isAdmin BOOLEAN
);

CREATE TABLE Categorie (
    ID_Categorie SERIAL PRIMARY KEY,
    NomCategorie VARCHAR(255)
);

CREATE TABLE BonPlan (
    ID_BonPlan SERIAL PRIMARY KEY,
    Titre VARCHAR(255),
    Description TEXT,
    LienAffiliation VARCHAR(255),
    DatePost DATE,
    ID_Utilisateur INT REFERENCES Utilisateur(ID_Utilisateur),
    ID_Categorie INT REFERENCES Categorie(ID_Categorie),
    ApprouvéParAdmin BOOLEAN
);

CREATE TABLE Commentaire (
    ID_Commentaire SERIAL PRIMARY KEY,
    Contenu TEXT,
    DateCommentaire DATE,
    ID_Utilisateur INT REFERENCES Utilisateur(ID_Utilisateur),
    ID_BonPlan INT REFERENCES BonPlan(ID_BonPlan)
);

CREATE TABLE Favori (
    ID_Utilisateur INT,
    ID_BonPlan INT,
    PRIMARY KEY (ID_Utilisateur, ID_BonPlan),
    FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateur(ID_Utilisateur),
    FOREIGN KEY (ID_BonPlan) REFERENCES BonPlan(ID_BonPlan)
);

CREATE TABLE CodePromo (
    ID_CodePromo SERIAL PRIMARY KEY,
    Code VARCHAR(255),
    Description TEXT,
    DateExpiration DATE,
    ID_Utilisateur INT REFERENCES Utilisateur(ID_Utilisateur),
    ApprouvéParAdmin BOOLEAN
);

CREATE TABLE Discussion (
    ID_Discussion SERIAL PRIMARY KEY,
    Titre VARCHAR(255),
    DateCreation DATE,
    ID_Utilisateur INT REFERENCES Utilisateur(ID_Utilisateur)
);

CREATE TABLE Message (
    ID_Message SERIAL PRIMARY KEY,
    Contenu TEXT,
    DateEnvoi DATE,
    ID_Utilisateur INT REFERENCES Utilisateur(ID_Utilisateur),
    ID_Discussion INT REFERENCES Discussion(ID_Discussion)
);
