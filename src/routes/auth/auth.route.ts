import { Router, Request, Response } from "express";

class AuthRoute {
  private path: string = "/";
  private router: Router;
  // private authController

  constructor () {
    this.router = Router();
  }

  public initializeRoute = (): void => {
    this.router.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        error: null,
        message: "User authentication route is healthy",
      });
    });
  };
}

export default AuthRoute;
