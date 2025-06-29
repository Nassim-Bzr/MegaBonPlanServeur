-- Création de la table codepromo
CREATE TABLE IF NOT EXISTS codepromo (
    id_codepromo SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    description TEXT,
    dateexpiration DATE,
    marchand VARCHAR(255),
    imgmarchand TEXT,
    reduction VARCHAR(100),
    montant DECIMAL(10, 2),
    id_utilisateur INTEGER REFERENCES utilisateur(id_utilisateur),
    approuveparadmin BOOLEAN DEFAULT FALSE
);

-- Insérer quelques données de test
INSERT INTO codepromo (code, description, marchand, imgmarchand, reduction, montant, approuveparadmin)
VALUES 
    ('SAVE20', '20% de réduction sur tous les articles', 'Amazon', 'https://logo.clearbit.com/amazon.com', '20%', 50.00, true),
    ('WELCOME10', '10€ offerts pour votre première commande', 'Fnac', 'https://logo.clearbit.com/fnac.com', '10€', 10.00, true),
    ('FLASH50', '50% de réduction flash', 'Cdiscount', 'https://logo.clearbit.com/cdiscount.com', '50%', 100.00, true)
ON CONFLICT DO NOTHING; 