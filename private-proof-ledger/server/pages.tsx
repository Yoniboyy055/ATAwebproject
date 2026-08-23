/**
 * Proof Ledger — page implementations.
 *
 * The files under `app/proof-ledger` are thin adapters that render these.
 */

import { isLedgerConfigured, readAuthConfig } from '../auth/config'
import LoginScreen from '../components/LoginScreen'
import ProofLedgerApp from '../components/ProofLedgerApp'
import StatementDocument from '../components/StatementDocument'
import { isLedgerDatabaseConfigured } from '../database/client'
import { getLedgerRepository } from '../database/prisma-repository'
import { getLedgerSession } from './session'
import { loadLedgerView } from './view'

function NotConfiguredScreen({ missing }: { missing: string[] }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">Proof Ledger</h1>
        <p className="mt-1 text-sm text-slate-400">Private Financial Record</p>
        <div className="mt-8 rounded-xl border border-amber-800 bg-amber-950/40 p-4">
          <p className="text-sm font-semibold text-amber-100">Server configuration incomplete</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-200/90">
            {missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-amber-200/70">
            See private-proof-ledger/README.md for setup. No values are stored in this repository.
          </p>
        </div>
      </div>
    </main>
  )
}

function missingConfiguration(): string[] {
  const auth = readAuthConfig()
  const missing: string[] = []
  if (!auth.sessionSecret || auth.sessionSecret.length < 32) missing.push('LEDGER_SESSION_SECRET')
  if (!auth.ownerPasswordHash) missing.push('LEDGER_OWNER_PASSWORD_HASH')
  if (!auth.viewerPasswordHash) missing.push('LEDGER_VIEWER_PASSWORD_HASH')
  if (!isLedgerDatabaseConfigured()) missing.push('LEDGER_DATABASE_URL')
  return missing
}

function DatabaseUnavailableScreen() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">Proof Ledger</h1>
        <div className="mt-8 rounded-xl border border-rose-800 bg-rose-950/40 p-4">
          <p className="text-sm font-semibold text-rose-100">Ledger database unavailable</p>
          <p className="mt-2 text-sm text-rose-200/90">
            The ledger could not be read. No record has been changed. Check that
            LEDGER_DATABASE_URL points at a reachable database and try again.
          </p>
        </div>
      </div>
    </main>
  )
}

/**
 * Record why the ledger could not be read.
 *
 * Only the error class and Prisma error code are logged. Prisma initialization
 * messages can embed the datasource URL, so the message itself is never
 * written to the log.
 */
function reportDatabaseUnavailable(error: unknown): void {
  const name = (error as { name?: string })?.name ?? 'UnknownError'
  const code = (error as { errorCode?: string })?.errorCode ?? 'none'
  console.error(`[proof-ledger] database unavailable: ${name} code=${code}`)
}

function isDatabaseUnavailable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const name = (error as { name?: string }).name ?? ''
  if (name === 'PrismaClientInitializationError' || name === 'LedgerDatabaseNotConfiguredError') {
    return true
  }
  const code = (error as { errorCode?: string; code?: string }).errorCode
  return typeof code === 'string' && /^P1\d{3}$/.test(code)
}

async function renderLedger(
  render: (view: Awaited<ReturnType<typeof loadLedgerView>>) => JSX.Element
) {
  const missing = missingConfiguration()
  if (missing.length > 0) return <NotConfiguredScreen missing={missing} />

  const repository = getLedgerRepository()

  try {
    const session = await getLedgerSession(repository)
    if (!session) return <LoginScreen configured={isLedgerConfigured()} />
    return render(await loadLedgerView(repository, session.role))
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      reportDatabaseUnavailable(error)
      return <DatabaseUnavailableScreen />
    }
    throw error
  }
}

export async function renderProofLedgerPage() {
  return renderLedger((view) => <ProofLedgerApp view={view} />)
}

export async function renderStatementPage() {
  return renderLedger((view) => <StatementDocument view={view} />)
}
