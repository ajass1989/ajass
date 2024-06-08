-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Racer" (
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
    "status1" TEXT,
    "time1" INTEGER,
    "status2" TEXT,
    "time2" INTEGER,
    "bestTime" INTEGER,
    "point" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Racer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("age", "bestTime", "bib", "category", "createdAt", "gender", "id", "isFirstTime", "kana", "name", "point", "seed", "special", "status1", "status2", "teamId", "time1", "time2", "updatedAt") SELECT "age", "bestTime", "bib", "category", "createdAt", "gender", "id", "isFirstTime", "kana", "name", coalesce("point", 0) AS "point", "seed", "special", "status1", "status2", "teamId", "time1", "time2", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
CREATE UNIQUE INDEX "Racer_bib_key" ON "Racer"("bib");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
