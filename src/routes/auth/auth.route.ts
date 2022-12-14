import { Router, Request, Response } from "express";
import AuthController from "../../controllers/auth/auth.controller";
import { GeneralApiResponse } from "../../interfaces";
import {
  isLoggedIn,
  notLoggedIn,
} from "../../middlewares/auth/auth.middleware";

class AuthRoute {
  private path: string = "/";
  public router: Router;
  private authController;

  constructor () {
    this.router = Router();
    this.authController = new AuthController();

    //initializing all the authentication routes
    this.initializeRoute();
  }

  private initializeRoute = (): void => {
    //base route to check route health
    this.router.get(`${this.path}`, (req: Request, res: Response) => {
      res.status(200).json({
        error: null,
        data: "User auth route healthy",
      } as GeneralApiResponse);
    });

    //post route to register the user
    this.router.post(
      `${this.path}register`,
      isLoggedIn,
      (req: Request, res: Response) => {
        //request forwarding to handle the request elements in the AuthController
        this.authController.register(req, res);
      },
    );

    //post route to login the user
    this.router.post(
      `${this.path}login`,
      isLoggedIn, //attaching a middleware with the login request that would prevent user from creating multiple sessions
      (req: Request, res: Response) => {
        //request forwarding to handle the request elements in the AuthController

        this.authController.login(req, res);
      },
    );

    //get route to logout the user
    this.router.get(
      `${this.path}logout`,
      notLoggedIn, //attaching a middleware with the logout that would prevent logout if not logged-in
      (req: Request, res: Response) => {
        //request forwarding to handle the request elements in the AuthController
        try {
          this.authController.logout(req, res);
        } catch (error) {
          return res.status(503).json({
            error,
            data: null,
          } as GeneralApiResponse);
        }
      },
    );
  };
}

export default AuthRoute;
