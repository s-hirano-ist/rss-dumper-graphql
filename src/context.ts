import { PrismaClient } from "@prisma/client";

export type Context = {
  prisma: PrismaClient;
  req: any; // HTTP request carrying the `Authorization` header
};

const prisma = new PrismaClient();

export function createContext(req: any) {
  return {
    ...req,
    prisma,
  };
}
