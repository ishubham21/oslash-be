import { Request, Response, Router } from "express";
import ShortcutController from "../../controllers/shortcuts/shortcuts.controller";
import { GeneralApiResponse } from "../../interfaces";
import { notLoggedIn } from "../../middlewares/auth/auth.middleware";

class ShortcutRoute {
  private shortcutContoller: ShortcutController;
  private path: string = "/";
  public router: Router;

  constructor () {
    this.router = Router();
    this.shortcutContoller = new ShortcutController();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.get(`${this.path}`, (req: Request, res: Response) => {
      res.status(200).json({
        error: null,
        data: "Shortcut route is healthy",
      } as GeneralApiResponse);
    });

    this.router.post(
      `${this.path}add`,
      notLoggedIn,
      (req: Request, res: Response) => {
        this.shortcutContoller.addShortcut(req, res);
      },
    );

    this.router.get(
      `${this.path}list`,
      notLoggedIn,
      (req: Request, res: Response) => {
        this.shortcutContoller.listShortcuts(req, res);
      },
    );

    this.router.post(
      `${this.path}delete`,
      notLoggedIn,
      (req: Request, res: Response) => {
        this.shortcutContoller.deleteShortcut(req, res);
      },
    );

    this.router.post(
      `${this.path}search`,
      notLoggedIn,
      (req: Request, res: Response) => {
        this.shortcutContoller.searchShortcuts(req, res);
      },
    );
  };
}

export default ShortcutRoute;
