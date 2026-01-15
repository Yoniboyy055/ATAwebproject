/**
 * FAQ Block
 * Frequently Asked Questions with collapsible answers
 */

import { z } from "zod";
import { ReactNode } from "react";

const FAQBlockPropsSchema = z.object({
  title: z.string().optional().default("Frequently Asked Questions"),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional().default([]),
});

export type FAQBlockProps = z.infer<typeof FAQBlockPropsSchema>;

export function FAQBlock(props: any): ReactNode {
  let validProps: FAQBlockProps;
  try {
    validProps = FAQBlockPropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">FAQ validation failed</div>;
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {validProps.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {validProps.title}
          </h2>
        )}
        <div className="space-y-4">
          {validProps.items.map((item, idx) => (
            <details
              key={idx}
              className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300"
            >
              <summary className="cursor-pointer font-semibold text-gray-900 flex justify-between items-center">
                {item.question}
                <span className="text-gray-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
