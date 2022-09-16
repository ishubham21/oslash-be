import { NextFunction, Request, Response } from "express";
import AuthController from "../../controllers/auth/auth.controller";
import { GeneralApiResponse } from "../../interfaces";

export const isLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authController = new AuthController();

  /**
   * If a cookie is already attached to the request, that means
   * the user is already logged in
   */
  if (authController.isLoggedIn(req)) {
    return res.status(406).json({
      error: "You are already logged-in",
      data: null,
    } as GeneralApiResponse);
  }

  next();
};

//middleware for authenticated requests
export const notLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authController = new AuthController();

  if (!authController.isLoggedIn(req)) {
    return res.status(406).json({
      error: "You must be logged-in to access this resource",
      data: null,
    } as GeneralApiResponse);
  }

  next();
};
