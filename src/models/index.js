/* eslint-disable import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeConfig from '../config/sequelize.config';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = sequelizeConfig[env];
const db = {};

if (env === 'staging' || env === 'production') {
  let auth = {};
  if (process.env.DATABASE_AUTHINFO) {
    auth = JSON.parse(process.env.DATABASE_AUTHINFO);
  }
  config.username = auth.username;
  config.password = auth.password;
  config.database = process.env.DB_PREFIX;
  config.host = process.env.DB_HOST;
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
