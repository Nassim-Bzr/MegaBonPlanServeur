const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration de base de données (utilise la même config que l'app)
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'megabonplan',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT) || 5432,
};

console.log('🔧 CORRECTION DE LA BASE DE DONNÉES MEGABONPLAN');
console.log('===============================================');

async function fixDatabase() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('📡 Connexion à la base de données...');
    await pool.connect();
    console.log('✅ Connexion réussie !');
    
    // Lire le script SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'migrations', 'fix_database_tables.sql'),
      'utf8'
    );
    
    console.log('📝 Exécution du script de correction...');
    
    // Diviser le script en requêtes individuelles
    const queries = sqlScript
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query) {
        try {
          console.log(`⚡ Exécution de la requête ${i + 1}/${queries.length}...`);
          const result = await pool.query(query);
          
          if (result.rows && result.rows.length > 0) {
            console.log('📊 Résultat:', result.rows);
          }
        } catch (error) {
          // Ignorer les erreurs "table already exists"
          if (!error.message.includes('already exists') && 
              !error.message.includes('déjà existe') &&
              !error.message.includes('column already exists')) {
            console.warn(`⚠️  Avertissement sur la requête ${i + 1}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Script de correction terminé !');
    
    // Vérifications finales
    console.log('\n🔍 VÉRIFICATIONS FINALES');
    console.log('========================');
    
    const verifications = [
      'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = \'Likes\'',
      'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = \'subscriptions\'',
      'SELECT COUNT(*) as count FROM information_schema.columns WHERE table_name = \'utilisateur\' AND column_name = \'verificationcode\'',
      'SELECT COUNT(*) as users FROM utilisateur',
      'SELECT COUNT(*) as bonplans FROM bonplan',
    ];
    
    for (const verification of verifications) {
      try {
        const result = await pool.query(verification);
        console.log(`✅ ${verification}: ${JSON.stringify(result.rows[0])}`);
      } catch (error) {
        console.log(`❌ ${verification}: Erreur - ${error.message}`);
      }
    }
    
    console.log('\n🎉 BASE DE DONNÉES CORRIGÉE AVEC SUCCÈS !');
    console.log('Vous pouvez maintenant redémarrer votre serveur avec: npm start');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    console.error('💡 Suggestions:');
    console.error('   - Vérifiez que PostgreSQL est démarré');
    console.error('   - Vérifiez vos paramètres de connexion');
    console.error('   - Créez la base de données "megabonplan" si elle n\'existe pas');
  } finally {
    await pool.end();
  }
}

// Exécuter le script
fixDatabase().catch(console.error); 