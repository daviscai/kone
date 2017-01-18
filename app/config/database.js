const database = {
  development: {
    username: 'root',
    password: 'cai123456',
    database: 'test',
    host: 'localhost',
    port : 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 1000
    }
  },
  test: {
    username: 'root',
    password: 'cai123456',
    database: 'test',
    host: 'localhost',
    port : 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 1000
    }
  },
  production: {
    username: 'root',
    password: 'cai123456',
    database: 'test',
    host: 'localhost',
    port : 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      idle: 1000
    }
  }
};

module.exports = database;
