CREATE TABLE "private_beta_invites" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "inviteCodeHash" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "acceptedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),

  CONSTRAINT "private_beta_invites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "private_beta_invites_email_key" ON "private_beta_invites"("email");
CREATE UNIQUE INDEX "private_beta_invites_inviteCodeHash_key" ON "private_beta_invites"("inviteCodeHash");

CREATE TABLE "private_beta_sessions" (
  "id" TEXT NOT NULL,
  "inviteId" TEXT NOT NULL,
  "principalId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),

  CONSTRAINT "private_beta_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "private_beta_sessions_inviteId_idx" ON "private_beta_sessions"("inviteId");
CREATE INDEX "private_beta_sessions_principalId_idx" ON "private_beta_sessions"("principalId");

ALTER TABLE "private_beta_sessions"
  ADD CONSTRAINT "private_beta_sessions_inviteId_fkey"
  FOREIGN KEY ("inviteId")
  REFERENCES "private_beta_invites"("id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
