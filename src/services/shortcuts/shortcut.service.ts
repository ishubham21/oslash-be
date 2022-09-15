import { PrismaClient } from "@prisma/client";

class ShortcutService {
  private prisma: PrismaClient;

  constructor () {
    this.prisma = new PrismaClient();
  }

}

export default ShortcutService