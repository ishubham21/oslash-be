import { User } from "@prisma/client";
import UserService from "../../../src/services/user/user.service";
import prismaClient from "../../../src/utils/prisma.util";

describe("getting user from their email", () => {
  let userService: any;
  let seededUser: User | null;

  beforeAll(async () => {
    //seeding dummy user in DB
    seededUser = await prismaClient.user.create({
      data: {
        name: "Dummy",
        email: "dummyseedemail@gmail.com",
        password: "dummy@password",
      },
    });

    userService = <any>new UserService();
  });

  afterAll(async () => {
    //clear the user after we have used it
    await prismaClient.user.delete({
      where: {
        email: "dummyseedemail@gmail.com",
      },
    });
  });

  it("should return the user data by making the use of email", async () => {
    try {
      const user: User | null = await userService.getUserFromEmail(
        "dummyseedemail@gmail.com",
      );

      expect(user!.email).toBe(seededUser!.email);
      expect(user!.name).toBe(seededUser!.name);
    } catch (error) {
      console.log("Error", error);
    }
  });

  it("should not return shortcuts if includeShortcus is passed false", async () => {
    try {
      const user: User | null = await userService.getUserFromEmail(
        "dummyseedemail@gmail.com",
        false,
      );

      expect((user! as any).shortcuts).toBeUndefined();
    } catch (error) {
      console.log("Error", error);
    }
  });

  it("should return shortcuts if includeShortcus is passed true", async () => {
    try {
      const user: User | null = await userService.getUserFromEmail(
        "dummyseedemail@gmail.com",
        true,
      );

      expect((user! as any).shortcuts).toStrictEqual([]);
    } catch (error) {
      console.log("Error", error);
    }
  });

  it("should return null if the user is not found", async () => {
    try {
      const user: User | null = await userService.getUserFromEmail(
        "completelyrandom123456789",
      );

      expect(user).toBeNull();
    } catch (error) {
      console.log("Error", error);
    }
  });
});

describe("get user from userId", () => {
  let userService: any;
  let seededUser: User | null;

  beforeAll(async () => {
    //seeding dummy user in DB
    seededUser = await prismaClient.user.create({
      data: {
        name: "Dummy",
        email: "dummyseedemail@gmail.com",
        password: "dummy@password",
      },
    });

    userService = <any>new UserService();
  });

  afterAll(async () => {
    //clear the user after we have used it
    await prismaClient.user.delete({
      where: {
        email: "dummyseedemail@gmail.com",
      },
    });
  });

  it("should return user data", async () => {
    try {
      const user: User | null = await userService.getUserFromId(
        seededUser!.id,
      );

      expect(user!.email).toBe(seededUser!.email);
      expect(user!.name).toBe(seededUser!.name);
    } catch (error) {
      console.log("Error", error);
    }
  });

  it("should return null if the user is not found", async () => {
    try {
      const user: User | null = await userService.getUserFromId(
        "completelyrandom123456789",
      );

      expect(user).toBeNull();
    } catch (error) {
      console.log("Error", error);
    }
  });
});
