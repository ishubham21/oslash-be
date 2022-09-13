import AuthService from "../../../src/services/auth/auth.service";
import { PrismaClient, User } from "@prisma/client";
import {
  ServiceError,
  UserRegistrationData,
} from "../../../src/interfaces";

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

describe("retrieve user", () => {
  let prismaClient: PrismaClient;
  let user: User | null;

  beforeAll(async () => {
    prismaClient = new PrismaClient();

    //create a user to be searched
    try {
      user = await prismaClient.user.create({
        data: {
          name: "Dummy",
          email: "dummy@gmail.com",
          password: "random-string",
        },
      });
    } catch (error) {
      console.log("A server-side error occured", error);
    }
  });

  afterAll(async () => {
    //delete the user from the DB after operations
    try {
      user = await prismaClient.user.delete({
        where: {
          email: "dummy@gmail.com",
        },
      });
    } catch (error) {
      console.log("A server-side error occured", error);
    }
  });

  test("user can be retrieved using email", async () => {
    const user: User = (await prismaClient.user.findUnique({
      where: {
        email: "dummy@gmail.com",
      },
    })) as User;

    expect(user.name).toBe("Dummy");
    expect(user.email).toBe("dummy@gmail.com");
  });

  test("getUser should result in null if a particular user is not found", async () => {
    const user: User | null = await prismaClient.user.findUnique({
      where: {
        email: "dummy-that-is-not-present@gmail.com",
      },
    });

    expect(user).toBe(null);
  });
});

describe("user registration - register function", () => {
  let authService: any;
  let prismaClient: PrismaClient;
  const data: UserRegistrationData = {
    name: "Dummy",
    email: "dummy@gmail.com",
    password: "random-string",
  };

  beforeAll(async () => {
    authService = <any>new AuthService();
    prismaClient = new PrismaClient();

    //create a user to be searched
    try {
      const user: User | null = await prismaClient.user.create({
        data,
      });
    } catch (error) {
      console.log("A server-side error occured", error);
    }
  });

  afterAll(async () => {
    //delete the user from the DB after operations
    try {
      await prismaClient.user.delete({
        where: {
          email: data.email,
        },
      });
    } catch (error) {
      console.log("A server-side error occured", error);
    }
  });

  test("user should not be registered if email already exists", async () => {
    let rejectionError: ServiceError = { error: null, code: 0 };

    try {
      await authService.register(data);
    } catch (error) {
      rejectionError = error;
    }

    expect(rejectionError).toStrictEqual({
      error: "User with this email already exists",
      code: 409,
    });
  });

  test("user must be registered in the database", async () => {
    const { id } = await prismaClient.user.create({
      data: {
        name: "Shubham",
        email: "ishubham2101@gmail.com",
        password: "iamshubhamspassword",
      },
    });

    const registered: User = (await prismaClient.user.findUnique({
      where: {
        id,
      },
    })) as User;

    expect(registered.email).toBe("ishubham2101@gmail.com");
    expect(registered.name).toBe("Shubham");
    expect(registered.id).toBe(id);

    await prismaClient.user.delete({
      where: {
        id,
      },
    });
  });
});
