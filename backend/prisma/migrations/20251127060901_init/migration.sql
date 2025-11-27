-- CreateTable
CREATE TABLE "MedicineItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "contact" TEXT NOT NULL,
    "profileImage" TEXT,
    "documentProof" TEXT,
    "drugName" TEXT NOT NULL,
    "medicineType" TEXT NOT NULL
);
