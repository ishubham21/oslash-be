import { Request, Response, Router } from "express";
import UserController from "../../controllers/user/user.controller";
import { GeneralApiResponse } from "../../interfaces";
import { notLoggedIn } from "../../middlewares/auth/auth.middleware";

class UserRoute {
  private userContoller: UserController;
  private path: string = "/";
  public router: Router;

  constructor () {
    this.router = Router();
    this.userContoller = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.get(`${this.path}`, (req: Request, res: Response) => {
      res.status(200).json({
        error: null,
        data: "User dashboard route is healthy",
      } as GeneralApiResponse);
    });

    this.router.get(
      `${this.path}dashboard`,
      notLoggedIn,
      (req: Request, res: Response) => {
        this.userContoller.userDashboard(req, res);
      },
    );
  };
}

export default UserRoute;
