import { genSalt } from "bcryptjs";
import { compare, hash } from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import {
  ServiceError,
  UserLoginData,
  UserRegistrationData,
  UserWithoutPassword,
} from "../../interfaces";

class AuthService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = new PrismaClient();
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
   * @param email - user email
   * @returns - Promise that either resolves to the user data or null
   */
  private getUserFromEmail = (
    email: string,
    includeShortcuts: boolean = false,
  ): Promise<User | null> => {
    return new Promise<User | null>((resolve, reject) => {
      /**
       * IIFE to prevent the application from let go of errors
       */
      (async () => {
        try {
          const user = await this.prisma.user.findUnique({
            where: {
              email,
            },
            include: {
              shortcuts: includeShortcuts,
            },
          });
          return resolve(user);
        } catch (error) {
          return reject(error);
        }
      })();
    });
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
          const user: User | null = await this.getUserFromEmail(
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

  public login = (data: UserLoginData) => {
    return new Promise<UserWithoutPassword>((resolve, reject) => {
      (async () => {
        try {
          const { email } = data;
          const user: User | null = await this.getUserFromEmail(
            email,
            true,
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

          //password matching
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

          //extracting password from the user
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