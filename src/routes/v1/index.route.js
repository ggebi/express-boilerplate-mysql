import _ from 'lodash';
import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import swaggerRoutes from './swagger.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: swaggerRoutes,
  },
];

_.forEach(defaultRoutes, (route) => {
  router.use(route.path, route.route);
});

if (['development', 'staging'].includes(process.env.NODE_ENV)) {
  _.forEach(devRoutes, (route) => {
    router.use(route.path, route.route);
  });
}

export default router;
