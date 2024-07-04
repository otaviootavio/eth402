import IORedis from "ioredis";

export const createRedisClient = () => {
  return new IORedis();
};
