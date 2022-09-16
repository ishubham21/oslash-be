import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { SESSION_NAME } from "../../config";
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
    oslashBeUserId: string;
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
    req.session!.oslashBeUserId = id; //setting userId to be equal to id
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
        } as GeneralApiResponse);
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

  /**
   *
   * @param req Express request
   * @param res Express response
   * @returns res.status.json - message to be sent back from the API
   */
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

        return res.status(200).json({
          data: user,
          error: null,
        } as GeneralApiResponse);

        //--request response--
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

  /**
   *
   * @param req Express request
   * @param res Express session
   * @returns A promise to tell if the cookie has been cleared or not
   */
  public logout = (req: Request, res: Response) => {
    /**
     * Deleting the session and thus, the corresponding cookie
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.destroy(err => {
      if (!err) {
        res.clearCookie(SESSION_NAME);
        /**
         * Sending back the response if the user is successfully logged-out
         */
        return res.status(200).json({
          data: "Logged-out successfully",
          error: null,
        } as GeneralApiResponse);
      }

      return res.status(503).json({
        error: "We were not able to log you out",
        data: null,
      } as GeneralApiResponse);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  public isLoggedIn = (req: Request) => !!req.session!.oslashBeUserId; //if the userId is not present
}

export default AuthController;
