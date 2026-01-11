#!/bin/bash
# Database setup script for Amanuel Travel

echo "🚀 Starting Amanuel Travel Backend Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo -e "${BLUE}📝 Please update .env.local with your configuration:${NC}"
    echo "  - DATABASE_URL (PostgreSQL connection)"
    echo "  - STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    exit 1
fi

echo -e "${GREEN}✅ Found .env.local${NC}"

# Generate NEXTAUTH_SECRET if not set
if grep -q "your-secret-key-change-in-production" .env.local; then
    echo -e "${BLUE}🔐 Generating NEXTAUTH_SECRET...${NC}"
    SECRET=$(openssl rand -base64 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your-secret-key-change-in-production/$SECRET/" .env.local
    else
        sed -i "s/your-secret-key-change-in-production/$SECRET/" .env.local
    fi
    echo -e "${GREEN}✅ Generated NEXTAUTH_SECRET${NC}"
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ $NODE_VERSION -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Generate Prisma Client
echo -e "${BLUE}📦 Generating Prisma Client...${NC}"
npm run prisma:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"

# Push schema to database
echo -e "${BLUE}🔄 Pushing schema to database...${NC}"
npm run db:push
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Database push failed. Make sure:${NC}"
    echo "  1. PostgreSQL is running"
    echo "  2. DATABASE_URL is correct in .env.local"
    echo "  3. Database exists and is accessible"
    exit 1
fi
echo -e "${GREEN}✅ Schema pushed to database${NC}"

# Seed database
read -p "Seed database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌱 Seeding database...${NC}"
    npm run db:seed
    echo -e "${GREEN}✅ Database seeded with sample data${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Backend Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📚 Next Steps:"
echo "  1. Start development server: npm run dev"
echo "  2. View database: npx prisma studio"
echo "  3. Read API docs: API_REFERENCE.md"
echo "  4. Check setup guide: DATABASE_SETUP.md"
echo ""
echo "🔗 Useful Links:"
echo "  - API Docs: API_REFERENCE.md"
echo "  - Setup Guide: DATABASE_SETUP.md"
echo "  - Prisma Docs: https://www.prisma.io/docs/"
echo "  - Stripe Docs: https://stripe.com/docs"
echo "  - NextAuth Docs: https://next-auth.js.org/"
echo ""
