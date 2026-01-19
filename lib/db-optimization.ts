/**
 * Prisma schema optimization recommendations
 * Add these indexes to your schema.prisma file for better query performance
 */

// Current indexes (add to prisma/schema.prisma):
/*

// Booking model indexes
model Booking {
  // ... existing fields ...
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@index([email])
  @@fulltext([fullName, email]) // MySQL full-text search
}

// Payment model indexes
model Payment {
  // ... existing fields ...
  
  @@index([bookingId])
  @@index([stripePaymentId])
  @@index([status])
  @@index([createdAt])
}

// Review model indexes
model Review {
  // ... existing fields ...
  
  @@index([packageId])
  @@index([destinationId])
  @@index([rating])
  @@index([createdAt])
}

// User model indexes
model User {
  // ... existing fields ...
  
  @@index([email])
  @@index([createdAt])
}

// Package model indexes
model Package {
  // ... existing fields ...
  
  @@index([destinationId])
  @@index([price])
  @@index([rating])
  @@index([createdAt])
  @@fulltext([title, description])
}

*/

/**
 * Database query optimization patterns
 */
export const dbOptimizationPatterns = {
  // ✓ Good: Fetch only needed fields
  goodSelectQuery: `
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        fullName: true,
        email: true,
        status: true,
      }
    })
  `,

  // ✗ Bad: Fetching all fields when only a few are needed
  badSelectQuery: `
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
      // Returns all fields including large JSON objects
    })
  `,

  // ✓ Good: Batch queries
  goodBatchQuery: `
    const [bookings, payments] = await Promise.all([
      prisma.booking.findMany({ where: { status: 'pending' } }),
      prisma.payment.findMany({ where: { status: 'processing' } })
    ])
  `,

  // ✗ Bad: Sequential queries
  badSequentialQuery: `
    const bookings = await prisma.booking.findMany()
    const payments = await prisma.payment.findMany()
    // Slower due to sequential execution
  `,

  // ✓ Good: Use pagination for large result sets
  goodPaginationQuery: `
    const page = 1
    const limit = 20
    const skip = (page - 1) * limit
    
    const [items, total] = await Promise.all([
      prisma.booking.findMany({ skip, take: limit }),
      prisma.booking.count()
    ])
  `,

  // ✓ Good: Use include only when needed
  goodIncludeQuery: `
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: { select: { status: true, amount: true } }
      }
    })
  `,
}

/**
 * Query performance tips:
 * 1. Use select() to fetch only necessary fields
 * 2. Use take() and skip() for pagination
 * 3. Use include() sparingly - prefer select() with manual joins
 * 4. Add indexes to frequently filtered/sorted columns
 * 5. Avoid N+1 queries - use batch operations
 * 6. Use Promise.all() for parallel queries
 * 7. Add @@unique constraints where appropriate
 * 8. Use full-text search for text filtering (MySQL)
 * 9. Denormalize data for frequently accessed info
 * 10. Monitor slow queries with Prisma Studio
 */

export const performanceGuidelines = `
DATABASE OPTIMIZATION CHECKLIST:

1. INDEXING
   - [ ] Add composite indexes for commonly filtered fields
   - [ ] Add index to foreign keys
   - [ ] Add index to frequently sorted columns
   - [ ] Monitor query performance with Prisma Studio

2. QUERY OPTIMIZATION
   - [ ] Use select() instead of include() where possible
   - [ ] Implement pagination for large datasets
   - [ ] Batch fetch related data
   - [ ] Use Promise.all() for parallel queries

3. SCHEMA OPTIMIZATION
   - [ ] Add unique constraints where appropriate
   - [ ] Consider denormalization for read-heavy data
   - [ ] Use appropriate data types (e.g., DateTime vs String)
   - [ ] Add @@fulltext indexes for text search

4. MONITORING
   - [ ] Enable query logging in development
   - [ ] Monitor slow query logs
   - [ ] Use Prisma Studio for analysis
   - [ ] Track query execution times

5. CACHING
   - [ ] Cache frequently accessed data (Redis)
   - [ ] Invalidate cache on updates
   - [ ] Use TTL for cached data
`
