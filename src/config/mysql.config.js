import mysql from 'mysql2';

// console.log(process.env);

let auth = {};
if (process.env.DATABASE_AUTHINFO) {
  auth = JSON.parse(process.env.DATABASE_AUTHINFO);
}

// module.exports = promisePool;

export default {
  MySQL: async () => {
    try {
      const pool = await mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: auth.username || process.env.DB_USER,
        password: auth.password || process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: process.env.DB_TIMEZONE,
        connectionLimit: 100,
      });

      const promisePool = await pool.promise();

      await promisePool.getConnection((error, connection) => {
        if (error) {
          if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            // console.log('Database connection was closed.');
          }
          if (error.code === 'ER_CON_COUNT_ERROR') {
            // console.log('Database has too many connections.');
          }
          if (error.code === 'ECONNREFUSED') {
            // console.log('Database connection was refused.');
          }
          throw new Error(error.message);
        }
        if (connection) connection.release();
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
