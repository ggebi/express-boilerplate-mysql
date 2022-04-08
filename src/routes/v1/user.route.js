import express from 'express';
import userController from '../../controllers/user.controller';
import authentication from '../../middlewares/authenticate.middleware';
import catchAsync from '../../middlewares/catchAsync.middleware';
import { verifyRights } from '../../middlewares/verifyRights.middleware';

const { authenticate } = authentication;
const {
  findAllUsers,
  findUserById,
  updateUser,
  updatePasswordUser,
  deleteUser,
  findMe,
} = userController;
const router = express.Router();

// 유저 리스트 조회
router.get(
  '/',
  authenticate,
  verifyRights('getUsers'),
  catchAsync(findAllUsers),
);
// 유저 상세 조회
router.get(
  '/:userId',
  authenticate,
  verifyRights('getUser'),
  catchAsync(findUserById),
);
// 유저 수정
router.patch(
  '/:userId',
  authenticate,
  verifyRights('updateUser'),
  catchAsync(updateUser),
);
// 유저 삭제
router.delete(
  '/:userId',
  authenticate,
  verifyRights('deleteUser'),
  catchAsync(deleteUser),
);
// 패스워드 변경
router.patch('/:userId/password', authenticate, catchAsync(updatePasswordUser));
// 내정보 상세 조회
router.get('/me', authenticate, catchAsync(findMe));

export default router;
