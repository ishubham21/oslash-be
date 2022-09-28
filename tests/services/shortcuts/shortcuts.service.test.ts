import ShortcutService from "../../../src/services/shortcuts/shortcut.service";
import { Shortcut, User } from "@prisma/client";
import prismaClient from "../../../src/utils/prisma.util";
import { ServiceError, ShortcutData } from "../../../src/interfaces";

describe("shortcut service", () => {
  let shortcutService: any;
  let shortcutData: Shortcut;
  let userData: User;

  beforeAll(async () => {
    shortcutService = <any>new ShortcutService();

    userData = await prismaClient.user.create({
      data: {
        name: "Dummy",
        email: "dummydataforshortcut@gmail.com",
        password: "dummy@password",
        shortcuts: {
          create: {
            shortlink: "github",
            url: "https://github.com",
            visits: 0,
            description: "This is a link to github",
            tags: ["github", "workspace"],
            visibility: "Workspace",
          },
        },
      },
      include: {
        shortcuts: true,
      },
    });

    shortcutData = (userData as any).shortcuts[0];
  });

  afterAll(async () => {
    await prismaClient.shortcut.delete({
      where: {
        shortlink_userId: {
          shortlink: shortcutData.shortlink,
          userId: userData.id,
        },
      },
    });

    await prismaClient.user.delete({
      where: {
        id: userData.id,
      },
    });
  });

  describe("search shortcut by shortlink", () => {
    it("should return the shortcut by shortlink", async () => {
      try {
        const searchedShortcut: Shortcut = await shortcutService.searchShortcutByShortlink(
          userData.id,
          shortcutData.shortlink,
        );

        expect(searchedShortcut.shortlink).toBe(
          shortcutData.shortlink,
        );
        expect(searchedShortcut.userId).toBe(userData.id);
        expect(searchedShortcut.url).toBe(shortcutData.url);
      } catch (error) {
        console.log("Error", error);
      }
    });
  });

  describe("add shortcut", () => {
    it("should add the shortcut in DB", async () => {
      try {
        await shortcutService.addShortcut(userData.id, {
          shortlink: "newlink",
          url: "https://newlink.com",
          visits: 0,
          description: "",
          tags: ["new", "link"],
          visibility: "Private",
        });

        const addedShortcut: Shortcut | null = await prismaClient.shortcut.findUnique(
          {
            where: {
              shortlink_userId: {
                shortlink: "newlink",
                userId: userData.id,
              },
            },
          },
        );

        //search for it in db
        expect(addedShortcut!.shortlink).toBe("newlink");
        expect(addedShortcut!.userId).toBe(userData.id);
        expect(addedShortcut!.url).toBe("https://newlink.com");

        //delete the shortcut
        await prismaClient.shortcut.delete({
          where: {
            shortlink_userId: {
              shortlink: "newlink",
              userId: userData.id,
            },
          },
        });
      } catch (error) {
        console.log("Error", error);
      }
    });

    it("should not add the shortcut if it is already present", async () => {
      try {
        await shortcutService.addShortcut(userData.id, {
          shortlink: "github",
          url: "https://newlink.com",
          visits: 0,
          description: "",
          tags: ["new", "link"],
          visibility: "Workspace",
        });

        const addedShortcut: Shortcut | null = await prismaClient.shortcut.findUnique(
          {
            where: {
              shortlink_userId: {
                shortlink: "newlink",
                userId: userData.id,
              },
            },
          },
        );
      } catch (error) {
        expect(error).toStrictEqual({
          error: "This shortcut already exists",
          code: 406,
        });
      }
    });
  });

  describe("delete shortcut", () => {
    let shortcutService: any;
    let shortcutData: Shortcut;
    let userData: User;

    beforeAll(async () => {
      //add it before
      shortcutService = <any>new ShortcutService();

      userData = await prismaClient.user.create({
        data: {
          name: "Dummy",
          email: "dummydelete@gmail.com",
          password: "dummy@password",
          shortcuts: {
            create: {
              shortlink: "github",
              url: "https://github.com",
              visits: 0,
              description: "This is a link to github",
              tags: ["github", "workspace"],
              visibility: "Workspace",
            },
          },
        },
        include: {
          shortcuts: true,
        },
      });

      shortcutData = (userData as any).shortcuts[0];
    });

    afterAll(async () => {
      //delete the user from the DB
      await prismaClient.user.delete({
        where: {
          id: userData.id,
        },
      });
    });

    it("should delete the given shortcut", async () => {
      try {
        await shortcutService.deleteShortcut(userData.id, "github");

        const deletedShortcut = await prismaClient.shortcut.findUnique(
          {
            where: {
              shortlink_userId: {
                shortlink: "github",
                userId: userData.id,
              },
            },
          },
        );

        expect(deletedShortcut).toBe(null);
      } catch (error) {
        console.log("Error", error);
      }
    });

    it("should give an error if the shortcut is not available", async () => {
      try {
        await shortcutService.deleteShortcut(
          userData.id,
          "averyrandomshortlinkthatdoesnotexists",
        );
      } catch (error) {
        expect(error).toStrictEqual({
          error:
            "The requested shortcut doesn't exist and hence can't be deleted",
          code: 406,
        });
      }
    });
  });

  describe("search shortcuts", () => {
    let shortcutService: any;
    let shortcutData: Shortcut;
    let userData: User;

    beforeAll(async () => {
      //add it before
      shortcutService = <any>new ShortcutService();

      userData = await prismaClient.user.create({
        data: {
          name: "Dummy",
          email: "dummysearch@gmail.com",
          password: "dummy@password",
          shortcuts: {
            createMany: {
              data: [
                {
                  shortlink: "github",
                  url: "https://github.com",
                  visits: 0,
                  description: "This is a link to github",
                  tags: ["github", "workspace"],
                  visibility: "Workspace",
                },
                {
                  shortlink: "shubham",
                  url: "https://meshubham.live",
                  visits: 0,
                  description: "This is a link to portfolio",
                  tags: ["shubham", "portfolio"],
                  visibility: "Private",
                },
              ],
            },
          },
        },
        include: {
          shortcuts: true,
        },
      });

      shortcutData = (userData as any).shortcuts[0];
    });

    afterAll(async () => {
      await prismaClient.shortcut.deleteMany({
        where: {
          userId: userData.id,
        },
      });

      await prismaClient.user.delete({
        where: {
          id: userData.id,
        },
      });
    });

    describe("searching on the basis of shortlink", () => {
      it("should search the given shortcut", async () => {
        try {
          const searchedShortcuts = await shortcutService.searchShortcuts(
            userData.id,
            {
              shortlink: "hub",
            },
          );

          expect(searchedShortcuts[0].shortlink).toBe("github");
          expect(searchedShortcuts[1].shortlink).toBe("shubham");
        } catch (error) {
          console.log("Error", error);
        }
      });

      it("should return an error if no shortcut is found", async () => {
        try {
          await shortcutService.searchShortcuts(
            userData.id,
            "veryrandomsomethinghere",
          );
        } catch (error) {
          expect(error).toStrictEqual({
            error: "No shortcut for this user could be found",
            code: 404,
          });
        }
      });
    });

    describe("searching based on visbility", () => {
      it("should search the given shortcut", async () => {
        try {
          const searchedShortcuts = await shortcutService.searchShortcuts(
            userData.id,
            {
              visibility: "Private",
            },
          );

          expect(searchedShortcuts[0].shortlink).toBe("shubham");
          expect(searchedShortcuts[1]).toBeUndefined();
        } catch (error) {
          console.log("Error", error);
        }
      });

      it("should return an error if no shortcut is found", async () => {
        try {
          await shortcutService.searchShortcuts(
            userData.id,
            "veryrandomsomethinghere",
          );
        } catch (error) {
          expect(error).toStrictEqual({
            error: "No shortcut for this user could be found",
            code: 404,
          });
        }
      });
    });

    describe("searching based on tag", () => {
      it("should search the given shortcut", async () => {
        try {
          const searchedShortcuts = await shortcutService.searchShortcuts(
            userData.id,
            {
              tag: "portfolio",
            },
          );

          expect(searchedShortcuts[0].shortlink).toBe("shubham");
          expect(searchedShortcuts[1]).toBeUndefined();
        } catch (error) {
          console.log("Error", error);
        }
      });

      it("should return an error if no shortcut is found", async () => {
        try {
          await shortcutService.searchShortcuts(
            userData.id,
            "veryrandomsomethinghere",
          );
        } catch (error) {
          expect(error).toStrictEqual({
            error: "No shortcut for this user could be found",
            code: 404,
          });
        }
      });
    });

    describe("searching based on url", () => {
      it("should search the given shortcut", async () => {
        try {
          const searchedShortcuts = await shortcutService.searchShortcuts(
            userData.id,
            {
              url: "meshubham.live",
            },
          );

          expect(searchedShortcuts[0].shortlink).toBe("shubham");
          expect(searchedShortcuts[1]).toBeUndefined();
        } catch (error) {
          console.log("Error", error);
        }
      });

      it("should return an error if no shortcut is found", async () => {
        try {
          await shortcutService.searchShortcuts(
            userData.id,
            "veryrandomsomethinghere",
          );
        } catch (error) {
          expect(error).toStrictEqual({
            error: "No shortcut for this user could be found",
            code: 404,
          });
        }
      });
    });
  });

  describe("get url from shortlink", () => {
    let shortcutService: any;
    let shortcutData: Shortcut;
    let userData: User;

    beforeAll(async () => {
      //add it before
      shortcutService = <any>new ShortcutService();

      userData = await prismaClient.user.create({
        data: {
          name: "Dummy",
          email: "dummysearch@gmail.com",
          password: "dummy@password",
          shortcuts: {
            createMany: {
              data: [
                {
                  shortlink: "github",
                  url: "https://github.com",
                  visits: 0,
                  description: "This is a link to github",
                  tags: ["github", "workspace"],
                  visibility: "Workspace",
                },
                {
                  shortlink: "shubham",
                  url: "https://meshubham.live",
                  visits: 0,
                  description: "This is a link to portfolio",
                  tags: ["shubham", "portfolio"],
                  visibility: "Private",
                },
              ],
            },
          },
        },
        include: {
          shortcuts: true,
        },
      });

      shortcutData = (userData as any).shortcuts[0];
    });

    afterAll(async () => {
      await prismaClient.shortcut.deleteMany({
        where: {
          userId: userData.id,
        },
      });

      await prismaClient.user.delete({
        where: {
          id: userData.id,
        },
      });
    });

    it("should give the given url from shortlink", async () => {
      let url = await shortcutService.getUrlFromShortlink(
        userData.id,
        "shubham",
      );

      expect(url).toBe("https://meshubham.live");

      url = await shortcutService.getUrlFromShortlink(
        userData.id,
        "github",
      );

      expect(url).toBe("https://github.com");
    });

    it("should return an error if shortcut does not exist", async () => {
      try {
        await shortcutService.searchShortcuts(
          userData.id,
          "veryrandomsomethinghere",
        );
      } catch (error) {
        expect(error).toStrictEqual({
          error:
            "veryrandomsomethinghere shortlink could not be found",
          code: 404,
        });
      }
    });
  });
});
