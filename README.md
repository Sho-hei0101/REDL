# Real Estate Deal & Lead CRM + Landing Page Generator

A production-ready SaaS template for real estate agents and small broker teams. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## 🎯 Features

### Core Functionality
- ✅ **Lead Management** - Capture and track leads through your sales pipeline
- ✅ **Property Listings** - Manage property portfolio with rich details
- ✅ **Deal Tracking** - Monitor deals from negotiation to close
- ✅ **Activity Log** - Complete audit trail of all interactions
- ✅ **Public Landing Pages** - Auto-generated property landing pages with contact forms
- ✅ **Dashboard Analytics** - Pipeline metrics and conversion tracking
- ✅ **User Authentication** - Secure login with NextAuth.js v5

### Lead Management
- Multiple lead sources (Landing Page, Manual, Referral, Other)
- Status tracking (New, Contacted, Viewing Scheduled, Offer Made, Closed, Lost)
- Budget range tracking
- Lead assignment to agents
- Activity history per lead
- Email and phone contact info

### Property Management
- Full property details (beds, baths, area, price)
- Image gallery support
- Property status management (Active, Under Contract, Sold, Off Market)
- Unique public URL for each property (`/p/[slug]`)
- Customizable landing page settings
- SEO meta tags for each property

### Deal Pipeline
- Link leads to properties
- Track deal stages (Negotiation, Under Contract, Closed, Fallthrough)
- Commission rate and value calculation
- Expected close date tracking
- Pipeline value metrics

### Landing Page Generator
- Beautiful responsive property pages
- Hero section with key details
- Image gallery
- Contact form with auto-lead creation
- No login required for visitors
- Mobile-optimized design

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL-ready)
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom shadcn/ui implementation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git (optional)

### Setup Steps

1. **Clone or download the project**
```bash
cd real-estate-crm
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production-min-32-chars"
```

**Important**: Change `NEXTAUTH_SECRET` to a secure random string in production. Generate one with:
```bash
openssl rand -base64 32
```

4. **Initialize the database**
```bash
# Run migrations
npx prisma migrate dev

# Seed with demo data
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Credentials

After seeding the database, you can log in with:

- **Admin User**
  - Email: `admin@demo.com`
  - Password: `Admin123!`

- **Agent User**
  - Email: `sarah@demo.com`
  - Password: `Agent123!`

## 🗄️ Database Schema

### Models
- **User** - Agent/admin accounts with role-based access
- **Lead** - Prospect contacts with status tracking
- **Property** - Property listings with full details
- **Deal** - Lead-property associations with stage tracking
- **Activity** - Complete activity log for leads, properties, and deals
- **LandingPageFormSubmission** - Public form submissions from property pages

### Database Provider

**Development**: SQLite (default)
- Simple file-based database
- No additional setup required
- Perfect for local development

**Production**: PostgreSQL (recommended)

To switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/realestate_crm"
```

3. Run migrations:
```bash
npx prisma migrate dev
```

## 📂 Project Structure

```
real-estate-crm/
├── app/
│   ├── (app)/              # Protected app routes
│   │   ├── app/
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── leads/      # Lead management
│   │   │   ├── properties/ # Property management
│   │   │   ├── deals/      # Deal pipeline
│   │   │   ├── activities/ # Activity log
│   │   │   └── settings/   # Settings page
│   │   └── layout.tsx      # App layout with sidebar
│   ├── (public)/           # Public routes
│   │   └── p/[slug]/       # Property landing pages
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth handlers
│   │   ├── leads/          # Lead CRUD operations
│   │   ├── properties/     # Property operations
│   │   └── landing-page/   # Public form submission
│   ├── login/              # Login page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── app-sidebar.tsx     # Navigation sidebar
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Database seeding script
│   └── migrations/         # Migration history
├── auth.ts                 # NextAuth configuration
├── middleware.ts           # Route protection
└── package.json
```

## 🎨 Customization

### Branding
- Update colors in `app/globals.css` (CSS variables)
- Change logo/name in `components/app-sidebar.tsx`
- Modify theme colors in Tailwind config

### Default Settings
Current defaults (displayed in Settings page):
- Currency: USD
- Default commission rate: 3%
- These can be made editable by creating a Settings model

### Landing Page Templates
Customize the property landing page design in:
- `app/(public)/p/[slug]/page.tsx`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Build
npm run build        # Create production build
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio (database GUI)

# Code Quality
npm run lint         # Run ESLint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub

2. Import project to Vercel

3. Set environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your production URL
   - `NEXTAUTH_SECRET` - Secure random string

4. Deploy!

### Railway / Render / Other Platforms

1. Create PostgreSQL database
2. Set environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm start`

## 🔒 Security Notes

- Change `NEXTAUTH_SECRET` in production
- Use PostgreSQL in production (not SQLite)
- Set proper CORS policies if needed
- Review and customize role-based permissions
- Implement rate limiting for public forms
- Add CAPTCHA to landing page forms in production

## 🎯 Next Steps / Roadmap

Suggested enhancements for production use:

- [ ] Email notifications for new leads
- [ ] SMS integration for agent alerts
- [ ] Calendar integration for viewings
- [ ] Document upload for deals
- [ ] Team collaboration features
- [ ] Advanced search and filtering
- [ ] Custom reporting and exports
- [ ] Integration with MLS systems
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## 📝 License

This is a commercial SaaS template for marketplace distribution (Gumroad, Lemon Squeezy, etc.).

## 🤝 Support

For support and customization services, contact your template provider.

## 🎉 Demo Data

The seed script creates:
- 2 users (1 admin, 1 agent)
- 4 properties with varied details
- 6 leads in different stages
- 5 deals across the pipeline
- 7 activity log entries
- 3 form submissions

All demo data uses Unsplash images and realistic sample information.

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**
