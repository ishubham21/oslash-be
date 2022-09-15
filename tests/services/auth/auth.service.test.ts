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
