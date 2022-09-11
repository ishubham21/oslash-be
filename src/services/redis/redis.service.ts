import Redis from "ioredis";
import connectRedis, { RedisStore } from "connect-redis";
import { REDIS_OPTIONS } from "../../config";
import session from "express-session";

class ConfigureRedis {
  private RedisStore: RedisStore;
  private redisClient: Redis;

  constructor () {
    //connectRedis is a class that makes use of express-session's session to connect to redis
    this.RedisStore = connectRedis(session);

    //configure a new redis client from ioredis
    this.redisClient = new Redis(REDIS_OPTIONS);

    this.redisClient.on("error", () => {
      throw "Error connecting with redis client";
    });
  }

  /**
   * @returns a new redis store to work with the express-session middleware
   */
  public get redisStore (): RedisStore {
    //creating a new instance of redis store class with our pre-configured redis client
    return new this.RedisStore({ client: this.redisClient });
  }
}

export default ConfigureRedis;
