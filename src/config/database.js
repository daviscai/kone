const database = {
  development: {
    username: 'root',
    password: 'cai123456',
    database: 'test',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql', // dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      idle: 10000 //If any connection was not used for 10000ms pool will release it
    }
  },
  test: {
    username: 'root',
    password: 'cai123456',
    database: 'test',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  },
  production: {
    username: 'root',
    password: 'cai123456',
    database: 'test',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  }
};

module.exports = database;
