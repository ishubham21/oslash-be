import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import {
  GeneralApiResponse,
  ServiceError,
  UserLoginData,
  UserRegistrationData,
  UserWithoutPassword,
} from "../../interfaces";
import AuthService from "../../services/auth/auth.service";

/**
 * Declrative merging
 */
declare module "express-session" {
  interface Session {
    userId: string;
  }
}

class AuthController {
  private authService;

  constructor () {
    this.authService = new AuthService();
  }

  /**
   *
   * @param userRegistrationData - an object with name, email, and password => required for registration
   * @returns - ValidationResult with error message
   */
  private validateRegistrationData = (
    userRegistrationData: UserRegistrationData,
  ): ValidationResult => {
    const schema = Joi.object({
      name: Joi.string()
        .min(3)
        .max(64)
        .trim()
        .required(),
      email: Joi.string()
        .email()
        .max(128)
        .trim()
        .required(),
      password: Joi.string()
        .min(6)
        .max(256)
        .required(),
    });

    return schema.validate(userRegistrationData);
  };

  /**
   *
   * @param userRegistrationData - email, password
   * @returns ValidationResult with error message
   */
  private validateLoginData = (
    userRegistrationData: UserLoginData,
  ): ValidationResult => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .max(128)
        .trim()
        .required(),
      password: Joi.string()
        .min(6)
        .max(256)
        .required(),
    });

    return schema.validate(userRegistrationData);
  };

  /**
   * This function helps in attesting "sid" cookie that tells the session-ID as it is stored in redis cache
   * Sid is also attached to every request thereafter. Hence, persisting the login
   * @param req - Express request
   * @param id - userId
   */
  private loginUserByPersistingCache = (req: Request, id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.userId = id; //setting userId to be equal to id
  };

  /**
   *
   * @param req Express request
   * @param res Express response
   * @returns res.status.json({...})
   */
  public register = async (req: Request, res: Response) => {
    /**
     * validating user registration data and sanitizing the req body
     */
    const userRegistrationData: UserRegistrationData = req.body;

    const validationError:
      | ValidationError
      | null
      | undefined = this.validateRegistrationData(
      userRegistrationData,
    ).error;

    /**
     * If there are no validation errors, register the user
     * Else, notify via API response
     */
    if (!validationError) {
      try {
        const id = await this.authService.register(
          userRegistrationData,
        );

        //logging-in the user in after the user has registered
        this.loginUserByPersistingCache(req, id);

        return res.status(201).json({
          error: null,
          data: {
            userId: id,
          },
        });
      } catch (serviceError) {
        const {
          error,
          code,
        }: ServiceError = serviceError as ServiceError;

        /**
         * Using the response code recieved from AuthService
         */
        return res.status(code | 503).json({
          error,
          data: null,
        } as GeneralApiResponse);
      }
    } else {
      return res.status(403).json({
        error: validationError.message,
        data: null,
      } as GeneralApiResponse);
    }
  };

  public login = async (req: Request, res: Response) => {
    const userLoginData: UserLoginData = req.body;

    const validationError:
      | ValidationError
      | null
      | undefined = this.validateLoginData(userLoginData).error;

    if (!validationError) {
      try {
        const user: UserWithoutPassword = await this.authService.login(
          userLoginData,
        );

        //--login logic--
        this.loginUserByPersistingCache(req, user.id);
      } catch (serviceError) {
        const {
          error,
          code,
        }: ServiceError = serviceError as ServiceError;

        /**
         * Using the response code recieved from AuthService
         */
        return res.status(code | 503).json({
          error,
          data: null,
        } as GeneralApiResponse);
      }
    } else {
      return res.status(403).json({
        error: validationError.message,
        data: null,
      } as GeneralApiResponse);
    }
  };

  public isLoggedIn = (req: Request) => !!req.session.userId; //if the userId is not present
}

export default AuthController;
