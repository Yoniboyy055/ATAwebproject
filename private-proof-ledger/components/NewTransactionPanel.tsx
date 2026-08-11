'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { LedgerSummary, WithdrawalView } from '../ledger/types'
import { formatDisplayDate, Money, Panel, Row, TYPE_LABELS } from './primitives'

interface Proposal {
  type: keyof typeof TYPE_LABELS
  date: string
  amountCents: number
  reason: string
  requiredRepaymentCents: number | null
  linkedTransactionCode: string | null
  baseEffectCents: number | null
  correctsTransactionCode: string | null
  originalInstruction: string
}

interface Preview {
  transactionCode: string
  withdrawalPrincipalCents: number | null
  extraRepaymentCents: number | null
  requiredRepaymentCents: number | null
  baseEffectCents: number
  linkedWithdrawalCode: string | null
  summaryBefore: LedgerSummary
  summaryAfter: LedgerSummary
  affectedWithdrawalBefore: WithdrawalView | null
  affectedWithdrawalAfter: WithdrawalView | null
}

type AnalysisState =
  | { kind: 'IDLE' }
  | { kind: 'PROPOSAL'; proposal: Proposal; preview: Preview; evidenceId: string; observations: string }
  | {
      kind: 'CONFLICT'
      message: string
      conflict: { field: string; screenshotValue: string; instructionValue: string; detail: string }
    }
  | { kind: 'BLOCKED'; message: string; detail?: string }

/**
 * Owner add-record flow.
 *
 * Screenshot + explanation → AI extraction → deterministic validation →
 * explicit owner confirmation → permanent record. No transaction exists until
 * "Apply Record" is pressed.
 */
export default function NewTransactionPanel() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [instruction, setInstruction] = useState('')
  const [state, setState] = useState<AnalysisState>({ kind: 'IDLE' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setState({ kind: 'IDLE' })
    setInstruction('')
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function analyze(event: React.FormEvent) {
    event.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setError('Attach the screenshot that proves this transaction.')
      return
    }
    setBusy(true)
    setError(null)
    setState({ kind: 'IDLE' })

    try {
      const form = new FormData()
      form.append('evidence', file)
      form.append('instruction', instruction)

      const response = await fetch('/api/proof-ledger/analyze', { method: 'POST', body: form })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(payload.error ?? 'The analysis could not be completed.')
        return
      }

      if (payload.status === 'CONFLICT') {
        setState({ kind: 'CONFLICT', message: payload.message, conflict: payload.conflict })
        return
      }
      if (payload.status === 'AMBIGUOUS' || payload.status === 'REJECTED') {
        setState({
          kind: 'BLOCKED',
          message: payload.message ?? payload.error,
          detail: payload.observations,
        })
        return
      }

      setState({
        kind: 'PROPOSAL',
        proposal: payload.proposal,
        preview: payload.preview,
        evidenceId: payload.evidence.id,
        observations: payload.observations ?? '',
      })
    } catch {
      setError('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  async function apply() {
    if (state.kind !== 'PROPOSAL') return
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/proof-ledger/transactions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...state.proposal, evidenceId: state.evidenceId }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error ?? 'The record could not be applied.')
        return
      }
      reset()
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel
      id="new"
      title="New Transaction"
      subtitle="Screenshot and explanation are analysed, then you confirm before anything is recorded."
    >
      <form onSubmit={analyze} className="space-y-3">
        <label htmlFor="evidence" className="block text-xs text-slate-400">
          Screenshot proof
        </label>
        <input
          ref={fileRef}
          id="evidence"
          name="evidence"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          capture="environment"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-slate-200"
        />

        <label htmlFor="instruction" className="block text-xs text-slate-400">
          Tell Proof Ledger what happened…
        </label>
        <textarea
          id="instruction"
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="I withdrew CAD $100. I need to return CAD $120. Do not change the original obligation."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        />

        {error ? (
          <p role="alert" className="rounded-lg bg-rose-950/60 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy || !instruction.trim()}
            className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-40"
          >
            {busy ? 'Analysing…' : 'Analyze Record'}
          </button>
          {state.kind !== 'IDLE' ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300"
            >
              Start over
            </button>
          ) : null}
        </div>
      </form>

      {state.kind === 'CONFLICT' ? (
        <div className="mt-5 rounded-lg border border-rose-800 bg-rose-950/50 p-4">
          <p className="text-sm font-semibold text-rose-100">Evidence Conflict Detected</p>
          <dl className="mt-2 space-y-1 text-sm text-rose-100/90">
            <div className="flex justify-between gap-3">
              <dt className="text-rose-300">Screenshot</dt>
              <dd>{state.conflict.screenshotValue}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-rose-300">Your instruction</dt>
              <dd>{state.conflict.instructionValue}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-rose-200/80">{state.conflict.detail}</p>
          <p className="mt-3 text-xs font-semibold text-rose-200">
            Nothing has been recorded. Correct the input and analyse again.
          </p>
        </div>
      ) : null}

      {state.kind === 'BLOCKED' ? (
        <div className="mt-5 rounded-lg border border-amber-800 bg-amber-950/40 p-4">
          <p className="text-sm font-semibold text-amber-100">{state.message}</p>
          {state.detail ? <p className="mt-2 text-xs text-amber-200/80">{state.detail}</p> : null}
          <p className="mt-3 text-xs font-semibold text-amber-200">Nothing has been recorded.</p>
        </div>
      ) : null}

      {state.kind === 'PROPOSAL' ? (
        <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Proposed Record
          </p>

          <div className="mt-3 divide-y divide-slate-800">
            <div className="flex justify-between gap-4 py-1.5 text-sm">
              <span className="text-slate-400">Transaction</span>
              <span className="font-semibold text-slate-100">
                {TYPE_LABELS[state.proposal.type]}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-1.5 text-sm">
              <span className="text-slate-400">Date</span>
              <span className="text-slate-100">{formatDisplayDate(state.proposal.date)}</span>
            </div>

            {state.proposal.type === 'WITHDRAWAL' ? (
              <>
                <Row label="Amount Withdrawn" cents={state.preview.withdrawalPrincipalCents ?? 0} />
                <Row label="Extra Repayment Added" cents={state.preview.extraRepaymentCents ?? 0} />
                <Row
                  label="Required Repayment"
                  cents={state.preview.requiredRepaymentCents ?? 0}
                  emphasis
                />
              </>
            ) : (
              <Row label="Amount" cents={state.proposal.amountCents} emphasis />
            )}

            {state.preview.linkedWithdrawalCode ? (
              <div className="flex justify-between gap-4 py-1.5 text-sm">
                <span className="text-slate-400">Linked withdrawal</span>
                <span className="text-slate-100">{state.preview.linkedWithdrawalCode}</span>
              </div>
            ) : null}

            <Row label="Effect on Base" cents={state.preview.baseEffectCents} signed />

            <div className="flex justify-between gap-4 py-1.5 text-sm">
              <span className="text-slate-400">Reason</span>
              <span className="max-w-[60%] text-right text-slate-100">{state.proposal.reason}</span>
            </div>
            <div className="flex justify-between gap-4 py-1.5 text-sm">
              <span className="text-slate-400">Evidence</span>
              <span className="text-slate-100">Attached</span>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Effect on the ledger
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Base Remaining</span>
                <span className="tabular-nums text-slate-200">
                  <Money cents={state.preview.summaryBefore.baseRemainingCents} /> →{' '}
                  <Money cents={state.preview.summaryAfter.baseRemainingCents} />
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Open Withdrawal Repayment</span>
                <span className="tabular-nums text-slate-200">
                  <Money cents={state.preview.summaryBefore.openWithdrawalRepaymentCents} /> →{' '}
                  <Money cents={state.preview.summaryAfter.openWithdrawalRepaymentCents} />
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="font-semibold text-slate-300">Total Currently Outstanding</span>
                <span className="tabular-nums font-semibold text-slate-100">
                  <Money cents={state.preview.summaryBefore.totalCurrentlyOutstandingCents} /> →{' '}
                  <Money cents={state.preview.summaryAfter.totalCurrentlyOutstandingCents} />
                </span>
              </div>
            </div>
          </div>

          {state.observations ? (
            <p className="mt-3 text-[11px] text-slate-500">Read from screenshot: {state.observations}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={apply}
              disabled={busy}
              className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-40"
            >
              {busy ? 'Applying…' : 'Apply Record'}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </Panel>
  )
}
