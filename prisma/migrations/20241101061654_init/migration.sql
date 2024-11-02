/*
  Warnings:

  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "authId" SET DATA TYPE TEXT,
ALTER COLUMN "authProvider" SET DATA TYPE TEXT;
