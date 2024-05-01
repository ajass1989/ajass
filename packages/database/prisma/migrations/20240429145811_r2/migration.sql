/*
  Warnings:

  - Added the required column `orderFemale` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderMale` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullname" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "orderMale" INTEGER NOT NULL,
    "orderFemale" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("createdAt", "eventId", "fullname", "id", "shortname", "updatedAt") SELECT "createdAt", "eventId", "fullname", "id", "shortname", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_fullname_key" ON "Team"("fullname");
CREATE UNIQUE INDEX "Team_orderMale_key" ON "Team"("orderMale");
CREATE UNIQUE INDEX "Team_orderFemale_key" ON "Team"("orderFemale");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
