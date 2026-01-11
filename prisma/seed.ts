import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/password'

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create packages
  const packages = await Promise.all([
    prisma.package.create({
      data: {
        type: 'Local',
        title: 'Complete Trip Support (Local)',
        description: 'Fast, clear support for local travelers without confusion',
        includes: [
          'Flight options + best routing',
          'Date flexibility planning (save money)',
          'Visa/document checklist (guidance)',
          'Hotel suggestions (if needed)',
          'WhatsApp support until confirmed',
        ],
        note: 'Fast, clear support—no confusion.',
      },
    }),
    prisma.package.create({
      data: {
        type: 'Local',
        title: 'Family / Group Trip Builder',
        description: 'Complete support for families and groups traveling together',
        recommended: true,
        includes: [
          'Multi-passenger routing + timing',
          'Seat/baggage guidance (airline-dependent)',
          'Stopover planning',
          'Document checklist for each traveler',
          'Priority WhatsApp coordination',
        ],
      },
    }),
    prisma.package.create({
      data: {
        type: 'Diaspora',
        title: 'Homecoming Plus (Diaspora)',
        description: 'Best route planning for diaspora returning home',
        includes: [
          'Best route planning (min stops / best timing)',
          'Arrival coordination guidance (pickup support if available)',
          'Airport navigation support',
          'Visa & entry document guidance',
          'Post-arrival settling support (accommodation, sim card, etc)',
        ],
      },
    }),
    prisma.package.create({
      data: {
        type: 'Diaspora',
        title: 'Business Traveler Package',
        description: 'Premium package for business travel needs',
        price: 599.99,
        includes: [
          'Flexible scheduling with business constraints',
          'Direct flight prioritization',
          'Hotel & transportation integration',
          'Visa expedited processing',
          '24/7 premium WhatsApp support',
          'Travel insurance options',
        ],
      },
    }),
  ])

  console.log(`✅ Created ${packages.length} packages`)

  // Create demo users
  const demoPassword = await hashPassword('DemoPassword123')

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: demoPassword,
        name: 'Demo User',
        phone: '+1234567890',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        password: demoPassword,
        name: 'John Doe',
        phone: '+2917197086',
      },
    }),
  ])

  console.log(`✅ Created ${users.length} demo users`)

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

  console.log(`✅ Created ${bookings.length} sample bookings`)

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

  console.log(`✅ Created ${quotes.length} sample quotes`)

  // Create newsletter subscriptions
  await prisma.newsletter.create({
    data: {
      email: 'subscriber@example.com',
    },
  })

  console.log('✅ Created newsletter subscription')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
