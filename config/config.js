require('dotenv').config(); // Charger les variables d'environnement

module.exports = {
  development: {
    username: "u5t38lc97arrqm",
    password: "p17ee10387b47cee2fe599aaa3c77c1127fb47488a61b604a54c7d41dc88ffa3d",
    database: "dbblq3u7d525e3",
    host: "c7u1tn6bvvsodf.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: "u5t38lc97arrqm",
    password: "p17ee10387b47cee2fe599aaa3c77c1127fb47488a61b604a54c7d41dc88ffa3d",
    database: "dbblq3u7d525e3",
    host: "c7u1tn6bvvsodf.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: "u5t38lc97arrqm",
    password: "p17ee10387b47cee2fe599aaa3c77c1127fb47488a61b604a54c7d41dc88ffa3d",
    database: "dbblq3u7d525e3",
    host: "c7u1tn6bvvsodf.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
