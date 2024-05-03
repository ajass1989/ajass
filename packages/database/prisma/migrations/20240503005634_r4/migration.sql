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
    "special" TEXT,
    "isFirstTime" BOOLEAN NOT NULL,
    "age" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Racer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Racer" ("age", "bib", "category", "createdAt", "gender", "id", "isFirstTime", "kana", "name", "seed", "special", "teamId", "updatedAt") SELECT "age", "bib", "category", "createdAt", "gender", "id", "isFirstTime", "kana", "name", "seed", "special", "teamId", "updatedAt" FROM "Racer";
DROP TABLE "Racer";
ALTER TABLE "new_Racer" RENAME TO "Racer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
