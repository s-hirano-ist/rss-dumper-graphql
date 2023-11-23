-- CreateEnum
CREATE TYPE "Scope" AS ENUM ('PUBLIC', 'AUTHENTICATED', 'ADMIN');

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "scope" "Scope" NOT NULL DEFAULT 'PUBLIC';
