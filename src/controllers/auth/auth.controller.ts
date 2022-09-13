import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import {
  GeneralApiResponse,
  ServiceError,
  UserRegistrationData,
} from "../../interfaces";
import AuthService from "../../services/auth/auth.service";

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
        .lowercase()
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
        return res.status(+code).json({
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
}

export default AuthController;
