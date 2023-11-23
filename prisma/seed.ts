import { PrismaClient } from "@prisma/client";
/* eslint no-restricted-imports: off */
import publicData from "./sampleData/public.json";
import authenticatedData from "./sampleData/authenticated.json";
import adminData from "./sampleData/admin.json";

const prisma = new PrismaClient();

async function main() {
  try {
    // UPSERT: if already exists then update, otherwise create
    await prisma.news.upsert({
      where: { id: 1 },
      update: {},
      create: {
        heading: publicData.heading,
        description: publicData.description,
        scope: publicData.scope,
        newsDetail: {
          create: publicData.body,
        },
      },
    });
    await prisma.news.upsert({
      where: { id: 2 },
      update: {},
      create: {
        heading: authenticatedData.heading,
        description: authenticatedData.description,
        scope: authenticatedData.scope,
        newsDetail: {
          create: authenticatedData.body,
        },
      },
    });
    await prisma.news.upsert({
      where: { id: 3 },
      update: {},
      create: {
        heading: adminData.heading,
        description: adminData.description,
        scope: adminData.scope,
        newsDetail: {
          create: adminData.body,
        },
      },
    });
    console.log("added sample data to the database");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
