-- CreateTable
CREATE TABLE "GuestbookMessage" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestbookMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestbookMessage_profileId_createdAt_idx" ON "GuestbookMessage"("profileId", "createdAt");

-- AddForeignKey
ALTER TABLE "GuestbookMessage" ADD CONSTRAINT "GuestbookMessage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
