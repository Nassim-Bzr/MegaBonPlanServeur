-- Migration pour ajouter le système d'abonnement et de température
-- Exécuter ce script sur votre base de données PostgreSQL

-- 1. Ajouter la colonne temperature_score à la table bonplan
ALTER TABLE bonplan ADD COLUMN IF NOT EXISTS temperature_score FLOAT DEFAULT 0;

-- 2. Créer la table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id_subscription SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL,
    plan_type VARCHAR(20) DEFAULT 'FREE' CHECK (plan_type IN ('FREE', 'PREMIUM', 'PREMIUM_PLUS')),
    posts_limit INTEGER NOT NULL DEFAULT 3,
    posts_used_this_month INTEGER DEFAULT 0,
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    price_paid DECIMAL(10, 2) DEFAULT 0.0,
    last_reset_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- 3. Créer un index sur id_utilisateur pour les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(id_utilisateur);

-- 4. Créer un index sur temperature_score pour le tri
CREATE INDEX IF NOT EXISTS idx_bonplan_temperature ON bonplan(temperature_score DESC);

-- 5. Créer un abonnement gratuit par défaut pour tous les utilisateurs existants
INSERT INTO subscriptions (id_utilisateur, plan_type, posts_limit, posts_used_this_month)
SELECT id_utilisateur, 'FREE', 3, 0 
FROM utilisateur 
WHERE id_utilisateur NOT IN (SELECT id_utilisateur FROM subscriptions)
ON CONFLICT DO NOTHING;

-- 6. Mettre à jour les scores de température pour tous les bons plans existants
UPDATE bonplan 
SET temperature_score = CASE 
    WHEN likes >= 100 THEN likes * 1.0
    WHEN likes >= 50 THEN likes * 0.8
    WHEN likes >= 20 THEN likes * 0.6
    WHEN likes >= 10 THEN likes * 0.4
    ELSE likes * 0.2
END;

-- 7. Créer une fonction pour recalculer automatiquement le score de température
CREATE OR REPLACE FUNCTION update_temperature_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.temperature_score = CASE 
        WHEN NEW.likes >= 100 THEN NEW.likes * 1.0
        WHEN NEW.likes >= 50 THEN NEW.likes * 0.8
        WHEN NEW.likes >= 20 THEN NEW.likes * 0.6
        WHEN NEW.likes >= 10 THEN NEW.likes * 0.4
        ELSE NEW.likes * 0.2
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Créer un trigger pour mettre à jour automatiquement le score
DROP TRIGGER IF EXISTS trigger_update_temperature_score ON bonplan;
CREATE TRIGGER trigger_update_temperature_score
    BEFORE UPDATE OF likes ON bonplan
    FOR EACH ROW
    EXECUTE FUNCTION update_temperature_score();

-- 9. Créer une fonction pour reset mensuel des compteurs de posts
CREATE OR REPLACE FUNCTION reset_monthly_posts()
RETURNS void AS $$
BEGIN
    UPDATE subscriptions 
    SET posts_used_this_month = 0,
        last_reset_date = NOW()
    WHERE EXTRACT(MONTH FROM last_reset_date) != EXTRACT(MONTH FROM NOW())
       OR EXTRACT(YEAR FROM last_reset_date) != EXTRACT(YEAR FROM NOW());
END;
$$ LANGUAGE plpgsql;

-- 10. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration du système d''abonnement et de température terminée avec succès !';
    RAISE NOTICE 'N''oubliez pas de configurer un cron job pour exécuter reset_monthly_posts() mensuellement.';
END $$; 