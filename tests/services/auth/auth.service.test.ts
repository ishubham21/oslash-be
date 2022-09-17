import AuthService from "../../../src/services/auth/auth.service";
import { User } from "@prisma/client";
import prismaClient from "../../../src/utils/prisma.util";
import { ServiceError } from "../../../src/interfaces";

describe("encryption and decryption", () => {
  //instantiating the AuthService class before moving
  let authService: any; //using any to typecast class

  beforeAll(async () => {
    //since typescript methods are attached during compile-time, we can use any to access private methods
    //doing it here to prevent it from poluuting the global scope
    authService = <any>new AuthService();
  });

  test("encrypted and decrypted passwords should match", async () => {
    const encryptedPassword: string = await authService.encryptPassword(
      "random-string",
    );
    const comparePassword: boolean = await authService.comparePassword(
      "random-string",
      encryptedPassword,
    );

    expect(comparePassword).toBeTruthy();
  });
});

describe("register functionality", () => {
  let authService: any;
  beforeAll(async () => {
    //seeding dummy user in DB
    await prismaClient.user.create({
      data: {
        name: "Dummy",
        email: "dummyseedemail@gmail.com",
        password: "dummy@password",
      },
    });

    authService = <any>new AuthService();
  });

  afterAll(async () => {
    //clear the user after we have used it
    await prismaClient.user.delete({
      where: {
        email: "dummyseedemail@gmail.com",
      },
    });
  });

  it("should register the user in the database", async () => {
    let userId: string;
    const data = {
      name: "Shubham",
      email: "randomemail@gmail.com",
      password: "github@ishubham21",
    };

    try {
      //this user has been registered
      userId = await authService.register(data);

      //check if this user has been registered or not
      const user: User | null = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      expect(userId).toBe(user!.id);
      expect(data.name).toBe(user!.name);
      expect(data.email).toBe(user!.email);

      //clearing up the dummy user
      await prismaClient.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.log(`Error:`, error);
    }
  });

  it("should not register the user if the user is already present", async () => {
    let registerError: ServiceError;
    const data = {
      name: "Dummy",
      email: "dummyseedemail@gmail.com",
      password: "dummy@password",
    };

    try {
      await authService.register(data);
    } catch (error) {
      registerError = error;
      expect(registerError).toStrictEqual({
        error: "User with this email already exists",
        code: 409,
      });
    }
  });
});

describe("login user", () => {
  let authService: any;
  beforeAll(async () => {
    //seeding dummy user in DB
    await prismaClient.user.create({
      data: {
        name: "Dummy",
        email: "dummyseedemail@gmail.com",
        password: "dummy@password",
      },
    });

    authService = <any>new AuthService();
  });

  afterAll(async () => {
    //clear the user after we have used it
    await prismaClient.user.delete({
      where: {
        email: "dummyseedemail@gmail.com",
      },
    });
  });

  it("should login the user and return user data upon login", async () => {
    const data = {
      email: "dummyseedemail@gmail.com",
      password: "dummy@password",
    };

    try {
      const loginData = await authService.login(data);

      expect(loginData.name).toBe("Dummy");
      expect(loginData.email).toBe(data.email);
    } catch (error) {
      console.log(`Error:`, error);
    }
  });

  it("return data should not contain user password", async () => {
    const data = {
      email: "dummyseedemail@gmail.com",
      password: "dummy@password",
    };

    try {
      const loginData = await authService.login(data);

      expect(loginData.password).toBeUndefined();
    } catch (error) {
      console.log(`Error:`, error);
    }
  });

  it("should return an error if the user is not found in the DB", async () => {
    let registerError: ServiceError;
    const data = {
      email: "random@gmail.com",
      password: "dummy@password",
    };

    try {
      await authService.login(data);
    } catch (error) {
      registerError = error;
      expect(registerError).toStrictEqual({
        error: "User with this email couldn't be found",
        code: 409,
      });
    }
  });

  it("should return an error if password is incorrect", async () => {
    let registerError: ServiceError;
    const data = {
      email: "dummyseedemail@gmail.com",
      password: "@password",
    };

    try {
      await authService.login(data);
    } catch (error) {
      registerError = error;
      expect(registerError).toStrictEqual({
        error: "Password is not valid",
        code: 401,
      });
    }
  });
});
