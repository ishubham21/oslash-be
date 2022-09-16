import express, {
  Application,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import session from "express-session";
import { NODE_ENV, PORT, SESSION_OPTIONS } from "./config";
import ConfigureRedis from "./services/redis/redis.service";
import AuthRoute from "./routes/auth/auth.route";
import { GeneralApiResponse } from "./interfaces";
import ShortcutRoute from "./routes/shortcuts/shortcuts.route";
import UserRoute from "./routes/user/user.route";

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
  private userAuthRoute: AuthRoute;
  private shortcutRoute: ShortcutRoute;
  private userRoute: UserRoute;

  constructor () {
    this.app = express();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.port = +PORT! || 4000;

    //configuring redis and fetching the value of redisStore that is newly configured with express-session
    this.redisStore = new ConfigureRedis().redisStore;
    this.userAuthRoute = new AuthRoute();
    this.shortcutRoute = new ShortcutRoute();
    this.userRoute = new UserRoute();

    this.configureExpressSessionMiddleware(); //must remain on TOP
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.handleMiscRoutes();
  }

  public listen = (): void => {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is up on the port: ${this.port}`);
    });
  };

  /**
   * To handle all middleware-related parts - making it modular to make it easier to test
   */
  private initializeMiddlewares = (): void => {
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
  };

  private initializeRoutes = (): void => {
    this.app.use("/auth", this.userAuthRoute.router);
    this.app.use("/user", this.userRoute.router);
    this.app.use("/shortcut", this.shortcutRoute.router);
  };

  private handleMiscRoutes = (): void => {
    /**
     * Base route - to check API health
     */
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        error: null,
        data: {
          server: "Base-Healthy",
        },
      } as GeneralApiResponse);
    });

    /**
     * Handling all undefined routes
     */
    this.app.all("*", (req: Request, res: Response) => {
      res.status(404).json({
        error: "Requested route doesn't exist - 404",
        data: null,
      } as GeneralApiResponse);
    });

    this.app.use(
      (req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({
          error: "Something broke on our end!",
          data: null,
        } as GeneralApiResponse);
      },
    );
  };

  /**
   * Configuring a middleware for express session to work with redis cache
   */
  private configureExpressSessionMiddleware = (): void => {
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
