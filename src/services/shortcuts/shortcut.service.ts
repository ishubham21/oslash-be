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
   * To search shortcuts using the shortlink
   * @param userId id of user who's currently logged in
   * @param shortlink shortlink to be searched
   * @returns promise that resolves to shortcut if found, else null
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
   * Adds shortcut to the particular user
   * @param shortcutData shortlink (required)
   * @param userId user id of the logged-in user
   * @returns a promise that resolves to shortlink
   */
  public addShortcut = (
    userId: string,
    shortcutData: ShortcutData,
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
   * @param userId - userId of the currently logged in user
   * @param sortBy - sortBy (createdAt/updatedAt/visits/shortlink)
   * @param orderBy - order of sorting (asc/desc)
   * @returns a promise with the sorted list of all shortcuts
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
   * To delete a given shortcut
   * @param userId - user id of the current logged in user
   * @param shortlink - shortlink to be deleted
   * @returns - promise that resolves to deleted shortlink
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
                "The requested shortcut doesn't exist and hence can't be deleted",
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

  /**
   * Helps in searching shortcuts
   * @param userId user id of the authenticated user
   * @param searchOptions - how to perform search (shortlink, url, visitsLow, visitsHigh)
   * @returns search results
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
           * Filtering shortcut that contains the given string from shortlink
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

          /**
           * Filtering visibility between Workspace or Private
           */
          if (searchOptions["visibility"]) {
            shortcuts = shortcuts.filter(shortcut => {
              return (
                shortcut.visibility.toLowerCase() ===
                searchOptions["visibility"]?.toLowerCase()
              );
            });
          }

          /**
           * Filterting from the tags
           */
          if (searchOptions["tag"]) {
            shortcuts = shortcuts.filter(shortcut => {
              return shortcut.tags.includes(searchOptions["tag"]!);
            });
          }

          /**
           * Filtering shortcut that contains the given string from url
           */
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

          /**
           * Checking against undefined because of 0 case
           * if 0 is passed by the user, it will also give false
           */
          if (
            searchOptions["visitsLow"] != undefined &&
            searchOptions["visitsHigh"] != undefined
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
            searchOptions["visitsLow"] != undefined &&
            searchOptions["visitsHigh"] == undefined
          ) {
            shortcuts = shortcuts.filter(shortcut => {
              return shortcut.visits >= searchOptions["visitsLow"]!;
            });
          }

          /**
           * If visitsHig is supplied but not visitsLow, give all the values smaller
           */
          if (
            searchOptions["visitsLow"] == undefined &&
            searchOptions["visitsHigh"] != undefined
          ) {
            shortcuts = shortcuts.filter(shortcut => {
              return shortcut.visits <= searchOptions["visitsHigh"]!;
            });
          }

          /**
           * If no shortcuts are present after search, inform the user
           */
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

  /**
   * To get url from shortlink and update the url hits (visit count)
   * @param userId - user id of the authenticated user
   * @param shortlink shorlink for which url is to be searched
   * @returns a promise that resolves to url for the provided shortlink
   */
  public getUrlFromShortlink = (
    userId: string,
    shortlink: string,
  ) => {
    return new Promise<string>((resolve, reject) => {
      (async () => {
        try {
          const shortcut: Shortcut | null = await this.searchShortcutByShortlink(
            userId,
            shortlink,
          );

          if (!shortcut) {
            return reject({
              error: `${shortlink} shortlink could not be found`,
              code: 404,
            });
          }

          /**
           * If the hit has been successful, update the visit counter
           */
          await this.prisma.shortcut.update({
            where: {
              shortlink_userId: {
                shortlink,
                userId,
              },
            },
            data: {
              visits: {
                increment: 1,
              },
            },
          });

          return resolve(shortcut.url);
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
