import redis from 'redis';
import { promisify } from 'util';

const redisClient = redis.createClient(6379, process.env.REDIS_HOST, {
  no_ready_check: true,
});

const getRedis = promisify(redisClient.get).bind(redisClient);
const setRedis = promisify(redisClient.set).bind(redisClient);
const incrbyRedis = promisify(redisClient.incrby).bind(redisClient);
const incrRedis = promisify(redisClient.incr).bind(redisClient);
const keysRedis = promisify(redisClient.keys).bind(redisClient);
const zaddRedis = promisify(redisClient.zadd).bind(redisClient);
const zrangeRedis = promisify(redisClient.zrange).bind(redisClient);
const zremRedis = promisify(redisClient.zrem).bind(redisClient);
const zscoreRedis = promisify(redisClient.zscore).bind(redisClient);

export {
  redisClient,
  zaddRedis,
  zrangeRedis,
  zremRedis,
  setRedis,
  getRedis,
  incrbyRedis,
  incrRedis,
  keysRedis,
  zscoreRedis,
};
