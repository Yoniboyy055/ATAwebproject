CREATE TABLE IF NOT EXISTS "ledger_transaction_evidence" (
  "id" TEXT PRIMARY KEY,
  "transactionId" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "ledger_transaction_evidence_transactionId_position_key"
  ON "ledger_transaction_evidence" ("transactionId", "position");

CREATE UNIQUE INDEX IF NOT EXISTS "ledger_transaction_evidence_transactionId_evidenceId_key"
  ON "ledger_transaction_evidence" ("transactionId", "evidenceId");

CREATE INDEX IF NOT EXISTS "ledger_transaction_evidence_evidenceId_idx"
  ON "ledger_transaction_evidence" ("evidenceId");
