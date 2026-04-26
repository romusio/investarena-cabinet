/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `RewardItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RewardItem_title_key" ON "RewardItem"("title");
