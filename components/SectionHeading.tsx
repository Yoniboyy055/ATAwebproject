export default function SectionHeading({children}:{children:React.ReactNode}){
  return (
    <header className="mb-6">
      <h2 className="text-2xl font-semibold">{children}</h2>
    </header>
  )
}
