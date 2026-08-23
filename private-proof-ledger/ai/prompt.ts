/**
 * Proof Ledger — AI interpreter contract.
 *
 * The model reads a screenshot plus the owner's explanation and returns a
 * structured proposal about one transaction. It never computes balances,
 * totals, status or any consequence — the deterministic engine does all of
 * that after validation.
 */

export interface AnalysisContext {
  todayIso: string
  openWithdrawals: Array<{
    transactionCode: string
    date: string
    principalCents: number
    extraRepaymentCents: number
    requiredRepaymentCents: number
    repaymentRemainingCents: number
  }>
}

export const PROPOSAL_TOOL_NAME = 'propose_ledger_record'

export const PROPOSAL_TOOL_SCHEMA = {
  type: 'object' as const,
  properties: {
    type: {
      type: 'string',
      enum: ['BASE_DEPOSIT', 'WITHDRAWAL', 'WITHDRAWAL_REPAYMENT', 'ADJUSTMENT'],
      description: 'The kind of transaction the screenshot and instruction describe.',
    },
    date: { type: 'string', description: 'Calendar date of the transaction as YYYY-MM-DD.' },
    amountCents: {
      type: 'integer',
      description:
        'Integer cents. For WITHDRAWAL this is the principal actually withdrawn, not the repayment.',
    },
    reason: { type: 'string', description: 'Short plain description of what the money was for.' },
    requiredRepaymentCents: {
      type: 'integer',
      description:
        'WITHDRAWAL only. Total the owner explicitly said must be returned. Omit when no extra was stated — never invent one.',
    },
    linkedTransactionCode: {
      type: 'string',
      description: 'WITHDRAWAL_REPAYMENT only. The TX code of the withdrawal being repaid.',
    },
    adjustmentScope: {
      type: 'string',
      enum: ['BASE_REMAINING', 'WITHDRAWAL_PRINCIPAL', 'EXTRA_REPAYMENT'],
      description:
        'ADJUSTMENT only. What the correction applies to. Omit for every other type.',
    },
    adjustmentEffectCents: {
      type: 'integer',
      description:
        'ADJUSTMENT only. Signed correction in cents. Omit for every other type.',
    },
    correctsTransactionCode: {
      type: 'string',
      description: 'ADJUSTMENT only. The TX code being corrected.',
    },
    confidence: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
    conflict: {
      type: 'object',
      description:
        'Set only when the screenshot and the written instruction materially disagree. Omit otherwise.',
      properties: {
        field: { type: 'string' },
        screenshotValue: { type: 'string' },
        instructionValue: { type: 'string' },
        detail: { type: 'string' },
      },
      required: ['field', 'screenshotValue', 'instructionValue', 'detail'],
      additionalProperties: false,
    },
    observations: { type: 'string', description: 'What was read from the screenshot.' },
  },
  required: ['type', 'date', 'amountCents', 'reason', 'confidence', 'observations'],
  additionalProperties: false,
}

export function buildSystemPrompt(context: AnalysisContext): string {
  const openList = context.openWithdrawals.length
    ? context.openWithdrawals
        .map(
          (w) =>
            `- ${w.transactionCode} (${w.date}): principal ${w.principalCents} cents, extra ${w.extraRepaymentCents} cents, required ${w.requiredRepaymentCents} cents, still outstanding ${w.repaymentRemainingCents} cents`
        )
        .join('\n')
    : '- none'

  return [
    'You are the evidence interpreter for a private two-person financial record called Proof Ledger.',
    'You read one screenshot of a bank transaction together with the owner\'s written explanation and return one structured proposal.',
    '',
    'Hard rules:',
    '1. You are an interpreter, not an accountant. Never compute balances, running totals, outstanding amounts or status.',
    '2. All money is integer cents. 100.00 dollars is 10000 cents.',
    '3. For WITHDRAWAL, amountCents is the principal withdrawn. Put the total the owner said must be returned in requiredRepaymentCents.',
    '4. If the owner did not state a larger repayment, set requiredRepaymentCents to null. Never invent an extra amount and never apply a percentage or interest.',
    '5. A withdrawal and its repayment never change the original obligation. Only a base deposit or an explicit adjustment does.',
    '6. If the screenshot and the instruction materially disagree about amount, date or direction, fill in "conflict" and set confidence to LOW.',
    '7. If you cannot confidently determine the transaction, set confidence to LOW and explain why in observations.',
    '8. Never guess a linked transaction code that is not in the open withdrawals list below.',
    '',
    `Today is ${context.todayIso}. Currency is CAD.`,
    'Open withdrawals currently in the ledger:',
    openList,
  ].join('\n')
}
