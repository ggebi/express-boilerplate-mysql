import db from '../models/index';
import { AuthenticationError, NotFoundError } from '../helpers/errors.helper';

export default {
  find: async (limit = 20, offset = 0) => {
    const users = await db.User.findAll({
      attributes: [
        'id',
        'userid',
        'name',
        'phone',
        'email',
        'createTime',
        'updateTime',
      ],
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [['id', 'DESC']],
    });

    return users;
  },
  findById: async (id) => {
    const user = await db.User.findOne({
      attributes: [
        'id',
        'userid',
        'name',
        'phone',
        'email',
        'createTime',
        'updateTime',
      ],
      where: [{ id }],
      limit: 1,
    });

    if (user !== null) {
      return user;
    } else {
      throw new NotFoundError('User not found');
    }
  },
  update: async (id, data) => {
    const updatedUser = await db.User.update(data, {
      where: [{ id }],
      limit: 1,
    });

    if (updatedUser !== null) {
      return updatedUser;
    } else {
      throw new NotFoundError('User not found');
    }
  },
  delete: async (id) => {
    const deletedUser = await db.User.findByIdAndDelete(id);

    if (deletedUser !== null) {
      return deletedUser;
    } else {
      throw new NotFoundError('User not found');
    }
  },
  comparePassword: async (password, userPassword) => {
    const checkPassword = await db.User.comparePassword(password, userPassword);

    if (!checkPassword) {
      throw new AuthenticationError('인증 에러');
    }
  },
};
