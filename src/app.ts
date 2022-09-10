import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import Redis from "ioredis";
import session from "express-session";
import connectRedis, { RedisStore } from "connect-redis";
import {
  NODE_ENV,
  PORT,
  REDIS_OPTIONS,
  SESSION_OPTIONS,
} from "./config";

class App {
  private app: Application;
  private port: number;
  private logPath: string = path.join(
    __dirname,
    "..",
    "logs",
    "access.log",
  );
  private RedisStore: RedisStore;
  private redisClient: Redis;

  constructor () {
    this.app = express();
    this.port = +PORT! || 4000;

    //redisStore is a class that makes use of session to connect to redis
    this.RedisStore = connectRedis(session);
    this.redisClient = new Redis(REDIS_OPTIONS);

    this.initializeMiddlewares();
    this.handleMiscRoutes();
  }

  public listen () {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is up on the port: ${this.port}`);
    });
  }

  private initializeMiddlewares () {
    this.app.use(cors());
    this.app.use(express.json());

    /**
     * Security headers to be attached with requests
     */
    this.app.use(helmet());

    /**
     * For log related services - only for dev server
     */
    if (NODE_ENV == "development" || NODE_ENV == "test") {
      const accessLogStream: fs.WriteStream = fs.createWriteStream(
        this.logPath,
        {
          flags: "a",
        },
      );
      this.app.use(
        morgan("common", {
          stream: accessLogStream,
        }),
      );
    }
  }

  private handleMiscRoutes = () => {
    /**
     * Base route - to check API health
     */
    this.app.get("/", (req, res) => {
      res.status(200).json({
        error: null,
        data: {
          server: "Base-Healthy",
        },
      });
    });

    /**
     * Handling all undefined routes
     */
    this.app.all("*", (req, res) => {
      res.status(404).json({
        error: "Requested route doesn't exist - 404",
        data: null,
      });
    });
  };

  private configureRedis = () => {
    /**
     * Configuring a middleware for express session to work with redis cache
     */
    this.app.use(
      session({
        ...SESSION_OPTIONS,

        //creating a new instance of redis store class with our pre-configured redis client
        store: new this.RedisStore({ client: this.redisClient }),
      }),
    );
  };
}

export default App;
