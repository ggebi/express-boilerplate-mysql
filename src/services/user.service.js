import db from '../models/index';
import { AuthenticationError } from '../helpers/errors.helper';

export default {
  find: async (limit = 20, offset = 0) => {
    const adpartners = await db.AdPartner.findAll({
      attributes: [
        'no',
        'userid',
        'level',
        'nickname',
        'name',
        'phone',
        'email',
        'createTime',
        'updateTime',
      ],
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [['no', 'DESC']],
    });

    return adpartners;
  },
  findById: async (id) => {
    const adpartner = await db.AdPartner.findOne({
      attributes: [
        'no',
        'userid',
        'level',
        'nickname',
        'name',
        'phone',
        'email',
        'reward',
        'bankName',
        'bankOwner',
        'bankAccount',
        'bankImageUrl',
        'createTime',
        'updateTime',
      ],
      where: [{ no: id }],
    });

    if (adpartner !== null) {
      return adpartner;
    } else {
      throw new Error('Adpartner not found');
    }
  },
  update: async (id, data) => {
    const updatedAdpartner = await db.AdPartner.update(data, {
      where: [{ no: id }],
    });

    if (updatedAdpartner !== null) {
      return updatedAdpartner;
    } else {
      throw new Error('Adpartner not found');
    }
  },
  delete: async (id) => {
    const deletedAdpartner = await db.AdPartner.findByIdAndDelete(id);

    if (deletedAdpartner !== null) {
      return deletedAdpartner;
    } else {
      throw new Error('Adpartner not found');
    }
  },
  comparePassword: async (password, userPassword) => {
    const checkPassword = await db.AdPartner.comparePassword(
      password,
      userPassword,
    );
    if (!checkPassword) {
      throw new AuthenticationError('인증 에러');
    }
  },
};
