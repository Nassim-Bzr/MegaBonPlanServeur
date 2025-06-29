-- Migration pour corriger la table utilisateur
-- Ajouter les colonnes manquantes pour la vérification par email

-- Ajouter les colonnes manquantes
ALTER TABLE utilisateur ADD COLUMN IF NOT EXISTS verificationcode VARCHAR(255);
ALTER TABLE utilisateur ADD COLUMN IF NOT EXISTS verificationcodeexpires TIMESTAMP;
ALTER TABLE utilisateur ADD COLUMN IF NOT EXISTS isverified BOOLEAN DEFAULT false;

-- Mettre tous les utilisateurs existants comme vérifiés
UPDATE utilisateur SET isverified = true WHERE isverified IS NULL;

-- Message de confirmation
SELECT 'Migration de la table utilisateur terminée avec succès !' as message; 