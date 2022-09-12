import { genSalt } from "bcryptjs";
import { compare, hash } from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { UserRegistrationData } from "../../interfaces";

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
  private getUserFromEmail = (email: string) => {
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
          });
          return resolve(user);
        } catch (error) {
          return reject(error);
        }
      })();
    });
  };

  public register = (data: UserRegistrationData) => {
    const { email } = data;

    return new Promise<unknown | void>((resolve, reject) => {
      /**
       * async IIFE - to escape promise executor function being async
       * this is necessary to catch errors
       */
      (async () => {
        try {
          const user = await this.getUserFromEmail(email);

          /**
           * If the user with the same email exists, do not register the user
           */
          if (!user) {
            return reject({
              error: "User with this email already exists",
              code: 409,
            });
          }

          //register user here
          //encrypt the password
          //save the user
        } catch (error) {
          return reject({
            error,
            code: 503,
          });
        }
      })();
    });
  };
}

export default AuthService;
