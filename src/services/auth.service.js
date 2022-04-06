import db from '../models/index';

async function createSocial({ channel, socialId }) {
  await db.UserSocialPassport.create({
    channel,
    socialId,
  });

  let UserSocialPassport = await db.UserSocialPassport.findOne({
    attributes: ['no', ['channel', 'nickName'], ['socialId', 'userId']],
    where: [{ channel, socialId }],
  });
  UserSocialPassport.level = 'user';

  return UserSocialPassport;
}

export default {
  findSocial: async ({ channel, socialId }) => {
    let UserSocialPassport = await db.UserSocialPassport.findOne({
      attributes: ['no', ['channel', 'nickName'], ['socialId', 'userId']],
      where: [{ channel, socialId }],
    });

    if (UserSocialPassport != null) {
      UserSocialPassport.level = 'user';
      return UserSocialPassport;
    } else {
      UserSocialPassport = await createSocial({ channel, socialId });
      return UserSocialPassport;
    }
  },
};
