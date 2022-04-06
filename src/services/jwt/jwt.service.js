import jwt from 'jsonwebtoken';
import moment from 'moment';
import { customAlphabet } from 'nanoid/non-secure';
import { ApplicationError } from '../../helpers/errors.helper';
import { accessExpireTime, refreshExpireTime } from '../../config/jwt.config';
import {
  redisClient,
  zaddRedis,
  zrangeRedis,
  zremRedis,
} from '../../config/redis.config';

const getDateTimestamp = function () {
  const date = moment.utc().format('X');
  return parseInt(date, 10);
};

/**
 * Access 토큰 생성
 * @param {int} userNo
 * @param {string} userId
 * @param {int} level
 * @returns string
 */
const generateAccessToken = async (userNo, userId, level) => {
  const accessToken = jwt.sign(
    {
      type: 'access',
      userNo,
      userId,
      level,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: accessExpireTime,
    },
  );
  return accessToken;
};
/**
 * Refresh 토큰 생성
 * @param {int} userNo
 * @param {string} userId
 * @returns string
 */
const generateRefreshToken = async (userNo, userId) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10);
  const jti = nanoid();
  const refreshtoken = jwt.sign(
    {
      type: 'refresh',
      userNo,
      userId,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: refreshExpireTime,
      jwtid: jti,
    },
  );

  // redis에 refreshtoken jti 저장 (중복로그인 방지)
  try {
    await zaddRedis(`refreshtoken:${userId}`, getDateTimestamp(), jti);
    redisClient.expire(`refreshtoken:${userId}`, refreshExpireTime);
    const range = await zrangeRedis(`refreshtoken:${userId}`, 0, -1);
    if (range.length > 1) {
      for (let i = 0; i < range.length - 1; i += 1)
        // eslint-disable-next-line no-await-in-loop
        await zremRedis(`refreshtoken:${userId}`, range[i]);
    }
  } catch (err) {
    // TODO: 에러처리 고민
    throw new ApplicationError(500, err);
  }
  return refreshtoken;
};

/**
 * refresh token의 jti 값이 유효한지 체크
 * @param {string} userId
 * @param {string} jti
 * @returns boolean
 */
const verifyJti = async (userId, jti) => {
  const range = await zrangeRedis(`refreshtoken:${userId}`, 0, -1);
  if (range[0] === jti) {
    return true;
  }
  return false;
};

export { generateAccessToken, generateRefreshToken, verifyJti };
