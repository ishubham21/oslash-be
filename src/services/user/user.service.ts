import { PrismaClient, User } from "@prisma/client";
import prismaClient from "../../utils/prisma.util";

class UserService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = prismaClient;
  }

  /**
   *
   * @param email - user email
   * @returns - Promise that either resolves to the user data or null
   */
  public getUserFromEmail = (
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
   * @param id - user id that is found in the cookies
   * @returns - Promise that either resolves to the user data or null
   */
  public getUserFromId = (id: string): Promise<User | null> => {
    return new Promise<User | null>((resolve, reject) => {
      (async () => {
        try {
          const user = await this.prisma.user.findUnique({
            where: {
              id,
            },
            include: {
              shortcuts: true,
            },
          });
          return resolve(user);
        } catch (error) {
          return reject(error);
        }
      })();
    });
  };
}

export default UserService;
