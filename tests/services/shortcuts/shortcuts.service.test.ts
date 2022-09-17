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
    it("should delete the given shortcut", async () => {
      //
    });
  });

  describe("search shortcuts", async () => {
    //
  });

  describe("get url from shortlink", async () => {
    //
  });
});
