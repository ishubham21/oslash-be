import { PrismaClient, Shortcut } from "@prisma/client";
import { ServiceError, ShortcutData } from "../../interfaces";
import prismaClient from "../../utils/prisma.util";

class ShortcutService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = prismaClient;
  }

  public searchShortcutByShortlink = (shortlink: string) => {
    return new Promise<Shortcut | null>((resolve, reject) => {
      (async () => {
        try {
          const shortcut: Shortcut | null = await this.prisma.shortcut.findUnique(
            {
              where: {
                shortlink,
              },
            },
          );

          return resolve(shortcut);
        } catch (error) {
          return reject(error);
        }
      })();
    });
  };

  public searchShortcutByUrl = (url: string) => {
    return new Promise<Shortcut | null>((resolve, reject) => {
      (async () => {
        try {
          const shortcut: Shortcut | null = await this.prisma.shortcut.findUnique(
            {
              where: {
                url,
              },
            },
          );

          return resolve(shortcut);
        } catch (error) {
          return reject(error);
        }
      })();
    });
  };

  public addShortcut = (
    shortcutData: ShortcutData,
    userId: string,
  ) => {
    return new Promise<string>((resolve, reject) => {
      (async () => {
        try {
          //check if the shortcut is already available or not
          const shortcutFromShortlink: Shortcut | null = await this.searchShortcutByShortlink(
            shortcutData.shortlink,
          );

          const shortcutFromUrl: Shortcut | null = await this.searchShortcutByUrl(
            shortcutData.url,
          );

          if (shortcutFromShortlink || shortcutFromUrl) {
            return reject({
              error: "This shortcut already exists",
              code: 406,
            } as ServiceError);
          }

          //adding a new shortcut if the no shortcut was found
          await this.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              shortcuts: {
                create: {
                  ...shortcutData,
                  /**
                   * Initialising visits with 0 at the time of creation
                   */
                  visits: 0,
                },
              },
            },
          });

          return resolve(shortcutData.shortlink);
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

export default ShortcutService;
