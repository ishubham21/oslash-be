import { NextFunction, Request, Response } from "express";
import AuthController from "../../controllers/auth/auth.controller";
import { GeneralApiResponse } from "../../interfaces";

export const isLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authController = new AuthController();

  //if the cookie is found in the request, we return this response
  //if a cookie is already attached to the request, trigger this
  if (authController.isLoggedIn(req)) {
    return res.status(406).json({
      error: "You are already logged-in",
      data: null,
    } as GeneralApiResponse);
  }

  next();
};

export const notLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authController = new AuthController();

  if (!authController.isLoggedIn(req)) {
    return res.status(406).json({
      error: "You are not logged-in",
      data: null,
    } as GeneralApiResponse);
  }

  next();
};
