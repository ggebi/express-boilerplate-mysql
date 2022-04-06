export default {
  development: {
    username: 'root',
    password: 'boilerplate10041004!',
    database: 'testdb',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  staging: {
    dialect: 'mysql',
    logging: false,
  },
  production: {
    dialect: 'mysql',
    logging: false,
  },
};
