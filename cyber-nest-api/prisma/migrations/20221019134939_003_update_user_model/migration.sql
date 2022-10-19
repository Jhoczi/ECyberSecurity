/*
  Warnings:

  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "PasswordSettings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "minLenght" INTEGER NOT NULL,
    "maxLenght" INTEGER NOT NULL,
    "oneDigit" BOOLEAN NOT NULL,
    "oneSpecial" BOOLEAN NOT NULL,

    CONSTRAINT "PasswordSettings_pkey" PRIMARY KEY ("id")
);
