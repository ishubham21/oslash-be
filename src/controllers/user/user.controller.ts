import { User } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { GeneralApiResponse, ServiceError } from "../../interfaces";
import UserService from "../../services/user/user.service";

class UserController {
  private userService;

  constructor () {
    this.userService = new UserService();
  }

  public userDashboard = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: string = req.session!.oslashBeUserId;
    if (!userId) {
      return res.status(406).json({
        error: "You must be logged-in to access this resource",
        data: null,
      } as GeneralApiResponse);
    }

    try {
      /**
       * Trying to add the shortcut in the DB
       */
      const user: User = (await this.userService.getUserFromId(
        userId,
      )) as User;

      if (!user) {
        return res.status(403).json({
          error: "The request seem to be infiltarated",
          data: null,
        } as GeneralApiResponse);
      }

      // eslint-disable-next-line prefer-const
      let { password, ...userWithoutPassword } = user;
      password = (null as unknown) as string;

      return res.status(201).json({
        error: null,
        data: {
          user: {
            ...userWithoutPassword,
          },
        },
      } as GeneralApiResponse);
    } catch (error) {
      /**
       * Using the response code recieved from AuthService
       */
      return res.status(503).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };
}

export default UserController;
