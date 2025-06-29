-- =================================================================
-- SCRIPT DE CORRECTION DES TABLES MANQUANTES - MEGABONPLAN
-- =================================================================

-- 1. Création de la table Likes (manquante)
CREATE TABLE IF NOT EXISTS "Likes" (
    id_like SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    id_bonplan INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_utilisateur, id_bonplan),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (id_bonplan) REFERENCES bonplan(id) ON DELETE CASCADE
);

-- 2. Création de la table subscriptions (manquante)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    plan_type VARCHAR(20) DEFAULT 'FREE' CHECK (plan_type IN ('FREE', 'PREMIUM', 'PREMIUM_PLUS')),
    posts_limit INTEGER DEFAULT 3,
    posts_used INTEGER DEFAULT 0,
    remaining_posts INTEGER GENERATED ALWAYS AS (posts_limit - posts_used) STORED,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED')),
    payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- 3. Ajout des colonnes manquantes dans la table utilisateur
ALTER TABLE utilisateur 
ADD COLUMN IF NOT EXISTS verificationcode VARCHAR(10),
ADD COLUMN IF NOT EXISTS verificationcodeexpires TIMESTAMP,
ADD COLUMN IF NOT EXISTS isverified BOOLEAN DEFAULT FALSE;

-- 4. Mise à jour des utilisateurs existants comme vérifiés (pour éviter les erreurs)
UPDATE utilisateur SET isverified = TRUE WHERE verificationcode IS NULL;

-- 5. Création des abonnements gratuits par défaut pour tous les utilisateurs existants
INSERT INTO subscriptions (user_id, plan_type, posts_limit, posts_used)
SELECT id, 'FREE', 3, 0 
FROM utilisateur 
WHERE id NOT IN (SELECT user_id FROM subscriptions);

-- 6. Correction de l'association alias dans la table favoris
-- Pas besoin de modification de table, juste s'assurer que les associations Sequelize sont correctes

-- 7. Ajout d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_likes_user_bonplan ON "Likes" (id_utilisateur, id_bonplan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_bonplan_temperature ON bonplan (temperature_score DESC);

-- 8. Mise à jour des températures des bons plans existants
UPDATE bonplan 
SET temperature_score = COALESCE(likes, 0) * 10 + 
                       CASE 
                         WHEN EXTRACT(DAY FROM (CURRENT_DATE - date_creation)) < 1 THEN 20
                         WHEN EXTRACT(DAY FROM (CURRENT_DATE - date_creation)) < 7 THEN 10
                         ELSE 0
                       END
WHERE temperature_score IS NULL;

-- 9. Fonction pour mettre à jour automatiquement la date de modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Déclencheurs pour la mise à jour automatique
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Vérifications finales
DO $$
BEGIN
    -- Vérifier que toutes les tables existent
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Likes') THEN
        RAISE EXCEPTION 'Table Likes non créée';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
        RAISE EXCEPTION 'Table subscriptions non créée';
    END IF;
    
    -- Vérifier les colonnes
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'utilisateur' AND column_name = 'verificationcode') THEN
        RAISE EXCEPTION 'Colonne verificationcode non ajoutée';
    END IF;
    
    RAISE NOTICE 'Migration terminée avec succès !';
END $$;

-- 12. Statistiques finales
SELECT 
    'Utilisateurs' as table_name, 
    COUNT(*) as count 
FROM utilisateur
UNION ALL
SELECT 
    'Bons Plans' as table_name, 
    COUNT(*) as count 
FROM bonplan
UNION ALL
SELECT 
    'Likes' as table_name, 
    COUNT(*) as count 
FROM "Likes"
UNION ALL
SELECT 
    'Subscriptions' as table_name, 
    COUNT(*) as count 
FROM subscriptions; 