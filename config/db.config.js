const { Pool } = require('pg');

const pool = new Pool({
    user: 'megabonplan',
    host: 'localhost',
    database: 'megabonplan',
    password: 'megabonplan',
    port: 5432, // Port par défaut de PostgreSQL
});

module.exports = pool;
