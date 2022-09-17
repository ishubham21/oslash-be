/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import { PrismaClient, Shortcut } from "@prisma/client";
import {
  SearchShortcutOptions,
  ServiceError,
  ShortcutData,
  SortingOptions,
  SortingOrders,
} from "../../interfaces";
import prismaClient from "../../utils/prisma.util";

class ShortcutService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = prismaClient;
  }

  /**
   *
   * @param userId
   * @param shortlink
   * @returns
   */
  public searchShortcutByShortlink = (
    userId: string,
    shortlink: string,
  ) => {
    return new Promise<Shortcut | null>((resolve, reject) => {
      (async () => {
        try {
          const shortcut: Shortcut | null = await this.prisma.shortcut.findUnique(
            {
              where: {
                // eslint-disable-next-line camelcase
                shortlink_userId: {
                  shortlink,
                  userId,
                },
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

  /**
   *
   * @param shortcutData
   * @param userId
   * @returns
   */
  public addShortcut = (
    shortcutData: ShortcutData,
    userId: string,
  ) => {
    return new Promise<string>((resolve, reject) => {
      (async () => {
        try {
          /**
           * check if the shortcut is already available for that particular user or not
           */
          const shortcutFromShortlink: Shortcut | null = await this.searchShortcutByShortlink(
            userId,
            shortcutData.shortlink,
          );

          if (shortcutFromShortlink) {
            return reject({
              error: "This shortcut already exists",
              code: 406,
            } as ServiceError);
          }

          /**
           * adding a new shortcut if the no shortcut was found
           */
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

  /**
   * List all the user shortcuts with the optional sorting filters
   * @param userId
   * @param sortBy
   * @param orderBy
   */
  public listShortcuts = (
    userId: string,
    sortBy: SortingOptions,
    orderBy: SortingOrders = "asc",
  ) => {
    return new Promise<Shortcut[] | [] | null>((resolve, reject) => {
      (async () => {
        try {
          /**
           * Sorting based on the options provided
           */
          const shortcuts:
            | Shortcut[]
            | [] = await this.prisma.shortcut.findMany({
            where: {
              userId,
            },
            orderBy: {
              [sortBy]: orderBy,
            },
          });

          if (shortcuts.length === 0) {
            return reject({
              error: "No shortcuts for this user could be found",
              code: 404,
            } as ServiceError);
          }

          return resolve(shortcuts);
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
   * @param userId
   * @param shortlink
   * @returns
   */
  public deleteShortcut = (userId: string, shortlink: string) => {
    return new Promise<string>((resolve, reject) => {
      (async () => {
        try {
          /**
           * Users should only be able to delete their own shotcuts
           */
          const shortcut: Shortcut | null = await this.searchShortcutByShortlink(
            userId,
            shortlink,
          );

          /**
           * Users can't delete a shotcut that is not present
           */
          if (!shortcut) {
            return reject({
              error:
                "The requested doesn't exist and hence can't be deleted",
              code: 406,
            } as ServiceError);
          }

          /**
           * Deleting a shortcut upon request
           */
          await this.prisma.shortcut.delete({
            where: {
              shortlink_userId: {
                userId,
                shortlink,
              },
            },
          });

          return resolve(shortlink);
        } catch (error) {
          return reject({
            error,
            code: 503,
          } as ServiceError);
        }
      })();
    });
  };

  private filterItems = (arr: any, query: string) => {
    //
  };
  /**
   *
   * @param userId
   * @param searchOptions
   * @returns
   */
  public searchShortcuts = (
    userId: string,
    searchOptions: SearchShortcutOptions,
  ) => {
    return new Promise<Shortcut[] | null>((resolve, reject) => {
      (async () => {
        try {
          /**
           * Collecting all the shortcuts of a particular user
           * Reduce database calls for optimisation
           */
          let shortcuts:
            | Shortcut[]
            | null = await this.prisma.shortcut.findMany({
            where: {
              userId,
            },
          });

          if (shortcuts.length == 0 || !shortcuts) {
            return reject({
              error: "No shortcut for this user could be found",
              code: 404,
            } as ServiceError);
          }

          /**
           * Filtering shortcut that contains the given string
           */
          if (searchOptions["shortlink"]) {
            shortcuts = shortcuts.filter(shortcut => {
              return (
                shortcut.shortlink.toLowerCase().indexOf(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  searchOptions["shortlink"]!.toLowerCase(),
                ) !== -1
              );
            });
          }

          if (searchOptions["visibility"]) {
            shortcuts = shortcuts.filter(shortcut => {
              return (
                shortcut.visibility.toLowerCase() ===
                searchOptions["visibility"]?.toLowerCase()
              );
            });
          }

          if (searchOptions["tag"]) {
            shortcuts = shortcuts.filter(shortcut => {
              return shortcut.tags.includes(searchOptions["tag"]!);
            });
          }

          if (searchOptions["url"]) {
            shortcuts = shortcuts.filter(shortcut => {
              return (
                shortcut.url.toLowerCase().indexOf(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  searchOptions["url"]!.toLowerCase(),
                ) !== -1
              );
            });
          }

          if (
            searchOptions["visitsLow"] &&
            searchOptions["visitsHigh"]
          ) {
            shortcuts = shortcuts.filter(shortcut => {
              return (
                shortcut.visits >= searchOptions["visitsLow"]! &&
                shortcut.visits <= searchOptions["visitsHigh"]!
              );
            });
          }

          /**
           * If visitsLow is supplied but not visitsHigh, give all the values greater
           */
          if (
            searchOptions["visitsLow"] &&
            !searchOptions["visitsHigh"]
          ) {
            shortcuts = shortcuts.filter(shortcut => {
              return shortcut.visits >= searchOptions["visitsLow"]!;
            });
          }

          /**
           * If visitsHig is supplied but not visitsLow, give all the values smaller
           */
          if (
            !searchOptions["visitsLow"] &&
            searchOptions["visitsHigh"]
          ) {
            shortcuts = shortcuts.filter(shortcut => {
              shortcut.visits <= searchOptions["visitsHigh"]!;
            });
          }

          if (shortcuts.length == 0 || !shortcuts) {
            return reject({
              error: "No shortcut for this search could be found",
              code: 404,
            } as ServiceError);
          }

          if (shortcuts.length == 0 || !shortcuts) {
            return reject({
              error: "No shortcut for this search could be found",
              code: 404,
            } as ServiceError);
          }

          return resolve(shortcuts);
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
