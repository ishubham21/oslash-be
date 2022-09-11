import { Router, Request, Response } from "express";
import { GeneralApiResponse } from "../../interfaces";

class AuthRoute {
  private path: string = "/";
  public router: Router;
  // private authController

  constructor () {
    this.router = Router();

    //initializing all the authentication routes
    this.initializeRoute();
  }

  private initializeRoute = (): void => {
    //base route to check route health
    this.router.get(`${this.path}`, (req: Request, res: Response) => {
      res.status(200).json({
        error: null,
        data: "User auth route - healthy",
      } as GeneralApiResponse);
    });

    //post route to register the user
    this.router.post(
      `${this.path}register`,
      (req: Request, res: Response) => {
        //request forwarding to handle the request elements in the AuthController
      },
    );
  };
}

export default AuthRoute;
