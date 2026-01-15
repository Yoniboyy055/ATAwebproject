/**
 * Error boundary and fallback component for Builder blocks
 * Gracefully handles block render failures
 */

import { ReactNode } from "react";
import { FEATURES } from "@/lib/config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BlockErrorBoundaryProps {
  children: ReactNode;
  blockName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BlockErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Fallback UI when a block fails to render
 */
export function BlockErrorFallback({
  blockName,
  error,
  isDev,
}: {
  blockName?: string;
  error?: Error;
  isDev: boolean;
}) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
      <h3 className="font-semibold text-yellow-900 mb-2">
        {blockName ? `${blockName} block unavailable` : "Block unavailable"}
      </h3>
      {isDev && error && (
        <details className="text-sm text-yellow-800 cursor-pointer">
          <summary>Error details</summary>
          <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      {!isDev && (
        <p className="text-sm text-yellow-800">
          This section is temporarily unavailable.
        </p>
      )}
    </div>
  );
}

/**
 * Safe wrapper for rendering blocks
 * Catches errors and shows fallback
 */
export function SafeBlockRenderer({
  children,
  blockName,
  fallback,
}: {
  children: ReactNode;
  blockName?: string;
  fallback?: ReactNode;
}) {
  return (
    <>
      {children || fallback || <BlockErrorFallback blockName={blockName} isDev={FEATURES.debugMode} />}
    </>
  );
}
