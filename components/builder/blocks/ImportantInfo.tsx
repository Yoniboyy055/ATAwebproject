/**
 * ImportantInfo Block
 * Display important information or warnings
 */

import { z } from "zod";
import { ReactNode } from "react";

const ImportantInfoPropsSchema = z.object({
  type: z.enum(["info", "warning", "success", "error"]).optional().default("info"),
  title: z.string().optional(),
  message: z.string().optional(),
  details: z.array(z.string()).optional(),
});

export type ImportantInfoProps = z.infer<typeof ImportantInfoPropsSchema>;

const stylesByType = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "ℹ️",
    textColor: "text-blue-900",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "⚠️",
    textColor: "text-yellow-900",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "✓",
    textColor: "text-green-900",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "✕",
    textColor: "text-red-900",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ImportantInfoBlock(props: any): ReactNode {
  let validProps: ImportantInfoProps;
  try {
    validProps = ImportantInfoPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">ImportantInfo validation failed</div>;
  }

  const styles = stylesByType[validProps.type];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-6 my-6`}>
      <div className="flex gap-4">
        <span className="text-2xl flex-shrink-0">{styles.icon}</span>
        <div>
          {validProps.title && (
            <h3 className={`font-semibold ${styles.textColor} mb-2`}>
              {validProps.title}
            </h3>
          )}
          {validProps.message && (
            <p className={`${styles.textColor} mb-3`}>{validProps.message}</p>
          )}
          {validProps.details && validProps.details.length > 0 && (
            <ul className={`${styles.textColor} text-sm space-y-1`}>
              {validProps.details.map((detail, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
