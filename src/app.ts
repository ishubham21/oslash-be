import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import session from "express-session";
import { NODE_ENV, PORT, SESSION_OPTIONS } from "./config";
import ConfigureRedis from "./services/redis/redis.service";

class App {
  private app: Application;
  private port: number;
  private logPath: string = path.join(
    __dirname,
    "..",
    "logs",
    "access.log",
  );
  private redisStore;

  constructor () {
    this.app = express();
    this.port = +PORT! || 4000;

    //configuring redis and fetching the value of redisStore that is newly configured with express-session
    this.redisStore = new ConfigureRedis().redisStore;

    this.initializeMiddlewares();
    this.handleMiscRoutes();
    this.configureExpressSessionMiddleware();
  }

  public listen () {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is up on the port: ${this.port}`);
    });
  }

  /**
   * To handle all middleware-related parts - making it modular to make it easier to test
   */
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

  /**
   * Configuring a middleware for express session to work with redis cache
   */
  private configureExpressSessionMiddleware = () => {
    this.app.use(
      session({
        ...SESSION_OPTIONS,

        //making use of redisStore instantiated from cache service
        store: this.redisStore,
      }),
    );
  };
}

export default App;
