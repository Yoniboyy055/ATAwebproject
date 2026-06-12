import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Upsert packages (safe to re-run)
  const packageData = [
    {
      type: 'Local',
      title: 'Economy Package',
      description: 'Affordable domestic travel package for budget-conscious travelers.',
      price: 299,
      recommended: false,
      includes: [
        'Economy class flight',
        'Airport transfer',
        'Travel documentation assistance',
      ],
      note: 'Available for most Ethiopian domestic routes',
    },
    {
      type: 'Local',
      title: 'Business Package',
      description: 'Premium domestic travel experience with priority services.',
      price: 599,
      recommended: true,
      includes: [
        'Business class flight',
        'Priority check-in',
        'Airport lounge access',
        'Airport transfer',
        'Travel documentation assistance',
        '24/7 support',
      ],
      note: 'Best value for frequent travelers',
    },
    {
      type: 'Diaspora',
      title: 'Standard Diaspora Package',
      description:
        'Complete travel solution for the Ethiopian diaspora community returning home.',
      price: 899,
      recommended: false,
      includes: [
        'International flight booking',
        'Airport pickup & drop-off',
        'Hotel recommendations',
        'Travel documentation assistance',
        'SIM card on arrival',
      ],
      note: 'Valid for Ethiopian diaspora worldwide',
    },
    {
      type: 'Diaspora',
      title: 'Premium Diaspora Package',
      description:
        'All-inclusive premium service for diaspora travelers. We handle everything.',
      price: 1499,
      recommended: true,
      includes: [
        'International business class flight',
        'Priority airport services',
        'Hotel booking assistance',
        'Full travel documentation support',
        'Dedicated agent',
        '24/7 concierge support',
        'SIM card & data plan on arrival',
        'Currency exchange assistance',
      ],
      note: 'Our most comprehensive package for VIP diaspora travelers',
    },
  ]

  const packages = await Promise.all(
    packageData.map(async (pkg) => {
      const existing = await prisma.package.findFirst({ where: { title: pkg.title } })
      let result
      if (existing) {
        result = await prisma.package.update({
          where: { id: existing.id },
          data: {
            type: pkg.type,
            description: pkg.description,
            price: pkg.price,
            recommended: pkg.recommended,
            includes: pkg.includes,
            note: pkg.note,
          },
        })
        console.log(`Updated package: "${result.title}" (${result.type})`)
      } else {
        result = await prisma.package.create({ data: pkg })
        console.log(`Created package: "${result.title}" (${result.type})`)
      }
      return result
    })
  )

  console.log(`Upserted ${packages.length} packages`)

  // Create demo users
  const demoPassword = await hashPassword('DemoPassword123')

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        password: demoPassword,
        name: 'Demo User',
        phone: '+1234567890',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        password: demoPassword,
        name: 'John Doe',
        phone: '+2917197086',
      },
    }),
  ])

  console.log(`Upserted ${users.length} demo users`)

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: users[0].id,
        packageId: packages[0].id,
        departureDate: new Date('2026-02-15'),
        returnDate: new Date('2026-02-25'),
        passengers: 2,
        destination: 'Asmara',
        status: 'pending',
        notes: 'Family trip for reunion',
      },
    }),
    prisma.booking.create({
      data: {
        userId: users[1].id,
        packageId: packages[2].id,
        departureDate: new Date('2026-03-01'),
        passengers: 1,
        destination: 'Addis Ababa',
        status: 'pending',
      },
    }),
  ])

  console.log(`Created ${bookings.length} sample bookings`)

  // Create sample quotes
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        userId: users[0].id,
        type: 'flight',
        description: 'Looking for affordable flights from New York to Asmara',
        phoneNumber: users[0].phone,
        email: users[0].email,
        status: 'pending',
      },
    }),
  ])

  console.log(`Created ${quotes.length} sample quotes`)

  // Create newsletter subscription
  await prisma.newsletter.upsert({
    where: { email: 'subscriber@example.com' },
    update: {},
    create: { email: 'subscriber@example.com' },
  })

  console.log('Upserted newsletter subscription')

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
