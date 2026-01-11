import { SchemaData } from '@/lib/schema'

interface StructuredDataProps {
  data: SchemaData | SchemaData[]
}

/**
 * Component to inject JSON-LD structured data into pages
 * Use in any page for SEO benefits
 */
export default function StructuredData({ data }: StructuredDataProps) {
  const schemaArray = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemaArray.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
