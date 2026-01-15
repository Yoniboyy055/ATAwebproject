/**
 * ItineraryTimeline Block
 * Display trip itinerary as a timeline
 */

import { z } from "zod";
import { ReactNode } from "react";

const ItineraryTimelinePropsSchema = z.object({
  days: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string().optional(),
    activities: z.array(z.string()).optional(),
  })).optional().default([]),
});

export type ItineraryTimelineProps = z.infer<typeof ItineraryTimelinePropsSchema>;

export function ItineraryTimelineBlock(props: any): ReactNode {
  let validProps: ItineraryTimelineProps;
  try {
    validProps = ItineraryTimelinePropsSchema.parse(props);
  } catch {
    return <div className="bg-red-50 p-4 text-red-700">ItineraryTimeline validation failed</div>;
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {validProps.days.map((dayItem, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {dayItem.day}
                </div>
                {idx < validProps.days.length - 1 && (
                  <div className="w-1 h-16 bg-blue-200 mt-2" />
                )}
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {dayItem.title}
                </h3>
                {dayItem.description && (
                  <p className="text-gray-600 mb-3">{dayItem.description}</p>
                )}
                {dayItem.activities && dayItem.activities.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {dayItem.activities.map((activity, aidx) => (
                      <li key={aidx}>{activity}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
