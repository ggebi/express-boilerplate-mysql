import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import xss from 'xss-clean';

/**
 * Custom error handling
 */
import errorHandler from './middlewares/errorHandler.middleware';
import { NotFoundError } from './helpers/errors.helper';

// Import database configuration
// import db from './models';

/**
 * Routes import
 * @type {Router | {readonly default?: Router}}
 */
import v1Routes from './routes/v1/index.route';

/**
 * Global env variables definition
 */
if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

/**
 * DB & Redis
 */
// db.sequelize.sync();

/**
 * Define Express
 * @type {*|Express}
 */
const app = express();

app.set('trust proxy', true);

/**
 * Middleware definition
 */
app.use(
  morgan(
    `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]  :response-time ms ":referrer" ":user-agent"`,
    {
      skip(req) {
        if (req.method === 'OPTIONS') {
          return true;
        }
        if (req.originalUrl === '/healthcheck') {
          return true;
        }
        return false;
      },
    },
  ),
);

/**
 * Set security HTTP Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

/**
 * Parse json request body
 */
app.use(express.json());

/**
 * Parse urlencoded request body
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Sanitize data
 */
app.use(xss());

/**
 * GZIP compression
 */
app.use(compression());

/**
 * Parsing cookie
 */
app.use(cookieParser());

/**
 * CORS policy configuration
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/**
 * ALB healthcheck
 */
app.get('/healthcheck', function (req, res) {
  return res.status(200).send('ok');
});

/**
 * Initialize Passport and pass the session to session storage of express
 */
app.use(passport.initialize());

/**
 * Routes definitions
 */
app.use('/admin/v1/', v1Routes);

/**
 * This helper function is useful if we use express as a pure API endpoint
 * Everytime you hit a route that doesn't exist it returns a json error 404
 */
// eslint-disable-next-line no-unused-vars
app.all('*', (_, res) => {
  throw new NotFoundError('Resource not found on this server!!');
});

app.use(errorHandler);

export default app;
