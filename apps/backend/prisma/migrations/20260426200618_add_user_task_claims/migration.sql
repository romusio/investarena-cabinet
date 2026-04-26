-- CreateTable
CREATE TABLE "UserTaskClaim" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskKey" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTaskClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTaskClaim_userId_taskKey_key" ON "UserTaskClaim"("userId", "taskKey");

-- AddForeignKey
ALTER TABLE "UserTaskClaim" ADD CONSTRAINT "UserTaskClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
