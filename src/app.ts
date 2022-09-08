import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { NODE_ENV, PORT } from "./config";

class App {
  private app: Application;
  private port: number;
  private logPath: string = path.join(
    __dirname,
    "..",
    "logs",
    "access.log",
  );

  constructor () {
    this.app = express();
    this.port = +PORT! || 4000;

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
}

export default App;
