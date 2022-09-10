import { RedisOptions } from "ioredis";

const {
  REDIS_PORT = 6379,
  REDIS_HOST = "redis", //also references as REDIS_URL //using redis as value defaults to the docker image that we have
  REDIS_PASSWORD = "secret",
} = process.env;

export const REDIS_OPTIONS: RedisOptions = {
  port: +REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
};
