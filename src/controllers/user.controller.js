import UserService from '../services/user.service';
import { validateSchema } from '../services/joi/joi.service';
import {
  ApplicationError,
  NotFoundError,
  AuthenticationError,
} from '../helpers/errors.helper';

export default {
  /**
   * 유저 리스트 조회
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  findAllUsers: async (req, res) => {
    try {
      const { limit, offset } = req.query;
      const users = await UserService.find(limit, offset);
      res.status(200).json({
        message: '유저 리스트 조회 성공',
        data: { users },
      });
    } catch (error) {
      throw new ApplicationError(500, error);
    }
  },
  /**
   * 유저 상세 조회
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  findUserById: async (req, res) => {
    try {
      const user = await UserService.findById(req.params.userId);
      res.status(200).json({
        message: '유저 상세 조회 성공',
        data: { user },
      });
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
  /**
   * 유저 수정
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  updateUser: async (req, res) => {
    try {
      const validatedData = await validateSchema.validateAsync(req.body);

      const user = await UserService.update(req.params.userId, validatedData);
      delete user.password;

      res.status(200).json({
        message: '유저 정보 업데이트 성공',
        data: { user },
      });
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
  /**
   * Delete user by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  deleteUser: async (req, res) => {
    try {
      await UserService.delete(req.params.userId);
      res.status(200).json({
        message: '유저 삭제 성공',
      });
    } catch (error) {
      throw new ApplicationError(500, error);
    }
  },
  findMe: async (req, res) => {
    try {
      const me = await UserService.findById(req.currentUser.userNo);
      res.status(200).json({
        message: '유저 내정보 조회 성공',
        data: { me },
      });
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  },
  updatePasswordUser: async (req, res) => {
    try {
      const { password, newPassword } = req.body;

      // if (
      //   req.user.level === 'user' &&
      //   req.user.no !== parseInt(req.params.userId, 10)
      // ) {
      //   return res.status(403).json({
      //     message: '권한 없음',
      //   });
      // }

      // 유효한 패스워드인지 체크
      await UserService.comparePassword(password, req.user.password);
      // 새로운 패스워드 반영
      await UserService.update(req.params.userId, {
        password: newPassword,
      });

      res.status(200).json({
        message: '유저 패스워드 업데이트 성공',
      });
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new NotFoundError(error.message);
      else if (error instanceof AuthenticationError)
        throw new AuthenticationError(error.message);
    }
  },
};
