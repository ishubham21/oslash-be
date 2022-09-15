import { PrismaClient, User } from "@prisma/client";

class UserService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = new PrismaClient();
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
}

export default UserService;
