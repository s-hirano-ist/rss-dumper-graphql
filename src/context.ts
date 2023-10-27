import { PrismaClient } from "@prisma/client";

export type Context = {
  prisma: PrismaClient;
};

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/require-await
export const createContext = async () => ({
  prisma,
});
