-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "setter" TEXT NOT NULL,
    "management" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Team" (
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

-- CreateTable
CREATE TABLE "Racer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "kana" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "bib" INTEGER,
    "gender" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "teamId" TEXT,
    "special" TEXT NOT NULL,
    "isFirstTime" BOOLEAN NOT NULL,
    "age" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Racer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "set" INTEGER NOT NULL,
    "time" INTEGER,
    "status" TEXT,
    "racerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Result_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Point" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointSkiMale" INTEGER NOT NULL,
    "pointSkiFemale" INTEGER NOT NULL,
    "pointSnowboardMale" INTEGER NOT NULL,
    "pointSnowboardFemale" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SpecialPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "point" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_fullname_key" ON "Team"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "Team_orderMale_key" ON "Team"("orderMale");

-- CreateIndex
CREATE UNIQUE INDEX "Team_orderFemale_key" ON "Team"("orderFemale");

-- CreateIndex
CREATE UNIQUE INDEX "Racer_bib_key" ON "Racer"("bib");

-- CreateIndex
CREATE UNIQUE INDEX "Result_set_racerId_key" ON "Result"("set", "racerId");
