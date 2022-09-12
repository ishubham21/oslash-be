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

  public register = async (req: Request, res: Response) => {
    //validating user registration data and sanitizing the req body
    const userRegistrationData: UserRegistrationData = req.body;

    const validationError:
      | ValidationError
      | null
      | undefined = this.validateRegistrationData(
      userRegistrationData,
    ).error;

    if (!validationError) {
      try {
        await this.authService.register(userRegistrationData);
      } catch (serviceError) {
        const {
          error,
          code,
        }: ServiceError = serviceError as ServiceError;
        return res.status(code).json({
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
