-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME,
    "location" TEXT,
    "race" TEXT,
    "setter" TEXT,
    "management" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullname" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Racer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "kana" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "bib" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "teamId" TEXT,
    "firstParticipate" BOOLEAN NOT NULL,
    "age" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Racer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RacerResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "set" INTEGER NOT NULL,
    "time" INTEGER,
    "status" TEXT,
    "racerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RacerResult_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_fullname_key" ON "Team"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "Racer_bib_key" ON "Racer"("bib");

-- CreateIndex
CREATE UNIQUE INDEX "RacerResult_set_racerId_key" ON "RacerResult"("set", "racerId");
