import { PrismaClient } from "@prisma/client";
import { UserRegistrationData } from "../../interfaces";

class AuthService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = new PrismaClient();
  }

  public register = async (data: UserRegistrationData) => {
    const { email } = data;

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      console.log(user);

      if (user) {
        throw new Error("User with this email already exists");
      }
    } catch (error) {
      throw new Error(
        "Error occured while trying to find a user with this email",
      );
    }
  };
}

export default AuthService;
