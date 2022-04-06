import express from 'express';
import authController from '../../controllers/auth.controller';
import authentication from '../../middlewares/authenticate.middleware';
import catchAsync from '../../middlewares/catchAsync.middleware';

const {
  login,
  signup,
  logout,
  refresh,
  check,
  protectedRoute,
  googleAuthenticate,
  appleAuthenticate,
  loginSocialGoogle,
  loginSocialApple,
} = authController;
const { authenticate } = authentication;

const router = express.Router();

router.post('/signup', catchAsync(signup));
router.post('/login', catchAsync(login));
router.post('/logout', catchAsync(logout));
router.post('/refresh', authenticate, catchAsync(refresh));
router.get('/check', authenticate, catchAsync(check));
router.get('/protected-route-test', authenticate, catchAsync(protectedRoute));

/* social login */
router.get('/login/google', googleAuthenticate);
router.get('/login/google/callback', catchAsync(loginSocialGoogle));
router.get('/login/apple', appleAuthenticate);
router.post('/login/apple/callback', catchAsync(loginSocialApple));

export default router;
