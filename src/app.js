import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import xss from 'xss-clean';

// Custom error handling
import errorHandler from './middlewares/errorHandler.middleware';
import { NotFoundError } from './helpers/errors.helper';

// Import database configuration
// import db from './models';

// Routes import
import v1Routes from './routes/v1/index.route';

// Global env variables definition
if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

// DB
// db.sequelize.sync();

const app = express();

app.set('trust proxy', true);

// Middleware definition

// app.use(
//   morgan(
//     `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]  :response-time ms ":referrer" ":user-agent"`,
//     {
//       skip(req) {
//         if (req.method === 'OPTIONS') {
//           return true;
//         }
//         if (req.originalUrl === '/healthcheck') {
//           return true;
//         }
//         return false;
//       },
//     },
//   ),
// );
app.use(morgan("combined"));

/**
 * Set security HTTP Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);


app.use(express.json()); // Parse json request body
app.use(express.urlencoded({ extended: true })); // Parse urlencoded request body
app.use(xss()); // Sanitize data
app.use(compression()); // GZIP compression
app.use(cookieParser()); // Parsing cookie

// CORS policy configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// ALB healthcheck
// app.get('/healthcheck', function (req, res) {
//   return res.status(200).send('ok');
// });

app.use(passport.initialize()); // Initialize Passport and pass the session to session storage of express

// Routes definitions
app.use('/admin/v1/', v1Routes);

app.all('*', (_, res) => {
  throw new NotFoundError('Resource not found on this server!!');
});

app.use(errorHandler);

export default app;
