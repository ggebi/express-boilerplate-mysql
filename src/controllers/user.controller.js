import debug from 'debug';
import UserService from '../services/user.service';
import { deleteBankAccountImage } from '../services/aws/aws.service';
import { validateSchema } from '../services/joi/joi.service';
import {
  ApplicationError,
  NotFoundError,
  AuthenticationError,
} from '../helpers/errors.helper';

const DEBUG = debug('dev');

export default {
  /**
   * Find all user accounts
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  findAllUsers: async (req, res) => {
    try {
      const { limit, offset } = req.query;
      const adpartners = await UserService.find(limit, offset);
      res.status(200).json({
        code: 2000,
        msg: '광고파트너 리스트 조회 성공',
        data: { adpartners },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Find User by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  findUserById: async (req, res) => {
    try {
      if (
        req.user.level === 'user' &&
        req.user.no !== parseInt(req.params.adptnId, 10)
      ) {
        return res.status(403).json({
          code: 4030,
          msg: '권한 없음',
        });
      }

      const adpartner = await UserService.findById(req.params.adptnId);
      res.status(200).json({
        code: 2000,
        msg: '광고파트너 상세 조회 성공',
        data: { adpartner },
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  /**
   * Update user by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  updateUser: async (req, res) => {
    try {
      // 롤 체크
      if (
        req.user.level === 'user' &&
        req.user.no !== parseInt(req.params.adptnId, 10)
      ) {
        return res.status(403).json({
          code: 4030,
          msg: '권한 없음',
        });
      }

      // validation
      const validatedData = await validateSchema.validateAsync(req.body);

      // 통장사본 이미지 삭제를 하나의 API로 처리하기 위해서 추가한 기능
      if (req.body.deleteBankImage === 'true') {
        if (req.user.bankImageUrl) {
          await deleteBankAccountImage(req.user.bankImageUrl);
          validatedData.bankImageUrl = '';
        }
      }

      // 업로드 파일이 존재하는 경우
      if (req.files.length) {
        validatedData.bankImageUrl = `${process.env.S3_STATIC_DOMAIN}/${req.files[0].key}`;
      }

      await UserService.update(req.params.adptnId, validatedData);
      const adpartner = await UserService.findById(req.params.adptnId);
      res.status(200).json({
        code: 2000,
        msg: '광고파트너 정보 업데이트 성공',
        data: { adpartner },
      });
    } catch (error) {
      console.log(error);
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
      await UserService.delete(req.params.adptnId);
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  findMe: async (req, res) => {
    try {
      const adpartner = await UserService.findById(req.currentUser.userNo);
      res.status(200).json({
        code: 2000,
        msg: '광고파트너 내정보 조회 성공',
        data: { adpartner },
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  updatePasswordUser: async (req, res) => {
    try {
      const { password, newPassword } = req.body;

      if (
        req.user.level === 'user' &&
        req.user.no !== parseInt(req.params.adptnId, 10)
      ) {
        return res.status(403).json({
          code: 4030,
          msg: '권한 없음',
        });
      }

      // TODO: body param validate
      await UserService.comparePassword(password, req.user.password);

      await UserService.update(req.params.adptnId, {
        password: newPassword,
      });

      res.status(200).json({
        code: 2000,
        msg: '광고파트너 패스워드 업데이트 성공',
        // data: { adpartner },
      });
    } catch (error) {
      DEBUG(error);
      if (error instanceof NotFoundError)
        throw new NotFoundError(error.message);
      else if (error instanceof AuthenticationError)
        throw new AuthenticationError(error.message);
    }
  },
};
