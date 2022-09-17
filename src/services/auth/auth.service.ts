import { genSalt } from "bcryptjs";
import { compare, hash } from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import {
  ServiceError,
  UserLoginData,
  UserRegistrationData,
  UserWithoutPassword,
} from "../../interfaces";
import UserService from "../user/user.service";
import prismaClient from "../../utils/prisma.util";

class AuthService {
  private prisma: PrismaClient;
  private userService: UserService;

  constructor () {
    this.prisma = prismaClient;
    this.userService = new UserService();
  }

  /**
   *
   * @param password - password recieved via POST request
   * @returns password hashed with a salt of 10
   */
  private encryptPassword = async (
    password: string,
  ): Promise<string> => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  };

  /**
   *
   * @param userPassword - password recieved via POST request
   * @param dbPassword - password stored in the database
   * @returns
   */
  private comparePassword = (
    userPassword: string,
    dbPassword: string,
  ): Promise<boolean> => {
    return compare(userPassword, dbPassword);
  };

  /**
   *
   * @param data - name, email, password recieved in request body
   * @returns - userId of the registered user
   */
  public register = (data: UserRegistrationData): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      /**
       * async IIFE - to escape promise executor function being async
       * this is necessary to catch errors
       */
      (async () => {
        try {
          const user: User | null = await this.userService.getUserFromEmail(
            data.email,
          );

          /**
           * If the user with the same email exists, do not register the user
           */
          if (user) {
            return reject({
              error: "User with this email already exists",
              code: 409,
            } as ServiceError);
          }

          /**
           * Encrypting the password before saving it in the DB
           */
          data.password = await this.encryptPassword(data.password);
          const { id } = await this.prisma.user.create({
            data,
          });

          return resolve(id);
        } catch (error) {
          return reject({
            error,
            code: 503,
          } as ServiceError);
        }
      })();
    });
  };

  /**
   *
   * @param data email, password
   * @returns Promise with resolve value of UserWithoutPassword
   */
  public login = (data: UserLoginData) => {
    return new Promise<UserWithoutPassword>((resolve, reject) => {
      (async () => {
        try {
          const { email } = data;
          const user: User | null = await this.userService.getUserFromEmail(
            email,
            false,
          );

          /**
           * If the user with the same email exists, do not register the user
           */
          if (!user) {
            return reject({
              error: "User with this email couldn't be found",
              code: 409,
            } as ServiceError);
          }

          /**
           * Comparing the password for equality
           */
          const userPassword = data.password,
            dbPassword = user.password;

          if (
            !(await this.comparePassword(userPassword, dbPassword))
          ) {
            return reject({
              error: "Password is not valid",
              code: 401,
            });
          }

          /**
           * Extract the password from user and equate it null to prevent leakage
           */
          // eslint-disable-next-line prefer-const
          let { password, ...userWithoutPassword } = user;
          password = (null as unknown) as string;

          resolve(userWithoutPassword); //sending back the user data
        } catch (error) {
          return reject({
            error,
            code: 503,
          } as ServiceError);
        }
      })();
    });
  };
}

export default AuthService;
