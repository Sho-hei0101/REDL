import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.landingPageFormSubmission.deleteMany();
  await prisma.property.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@demo.com',
      hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user');

  // Create agent user
  const agentPassword = await bcrypt.hash('Agent123!', 10);
  const agent = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@demo.com',
      hashedPassword: agentPassword,
      role: 'AGENT',
    },
  });
  console.log('✅ Created agent user');

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Modern Downtown Loft',
      slug: 'modern-downtown-loft',
      address: '123 Main Street, Unit 501',
      city: 'New York',
      country: 'USA',
      price: 850000,
      status: 'ACTIVE',
      mainImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      gallery: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800,https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800,https://images.unsplash.com/photo-1502672260066-6bc35f0a1611?w=800',
      beds: 2,
      baths: 2,
      areaSqm: 120,
      description: 'Stunning modern loft in the heart of downtown. Features high ceilings, floor-to-ceiling windows, and premium finishes throughout. Walking distance to restaurants, shops, and entertainment.',
      published: true,
      heroTitle: 'Your Dream Downtown Loft Awaits',
      heroSubtitle: 'Modern living in the heart of the city',
      ctaText: 'Schedule a Private Viewing',
      metaTitle: 'Modern Downtown Loft - 2 Bed 2 Bath | $850,000',
      metaDescription: 'Luxurious downtown loft with stunning city views. 2 bedrooms, 2 bathrooms, 120 sqm. Premium finishes and modern design.',
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: 'Suburban Family Home',
      slug: 'suburban-family-home',
      address: '456 Oak Avenue',
      city: 'Austin',
      country: 'USA',
      price: 675000,
      status: 'ACTIVE',
      mainImageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      gallery: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800,https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      beds: 4,
      baths: 3,
      areaSqm: 220,
      description: 'Beautiful family home in a quiet suburban neighborhood. Large backyard perfect for kids and pets. Excellent school district.',
      published: true,
      ctaText: 'Book a Tour',
    },
  });

  const property3 = await prisma.property.create({
    data: {
      title: 'Beachfront Condo',
      slug: 'beachfront-condo',
      address: '789 Ocean Drive, Unit 12A',
      city: 'Miami',
      country: 'USA',
      price: 1200000,
      status: 'UNDER_CONTRACT',
      mainImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      gallery: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      beds: 3,
      baths: 2,
      areaSqm: 150,
      description: 'Luxury beachfront condo with panoramic ocean views. Resort-style amenities including pool, gym, and concierge service.',
      published: false,
    },
  });

  const property4 = await prisma.property.create({
    data: {
      title: 'Mountain View Cabin',
      slug: 'mountain-view-cabin',
      address: '321 Pine Ridge Road',
      city: 'Denver',
      country: 'USA',
      price: 450000,
      status: 'ACTIVE',
      mainImageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      gallery: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      beds: 3,
      baths: 2,
      areaSqm: 180,
      description: 'Cozy mountain cabin with breathtaking views. Perfect weekend getaway or full-time mountain living.',
      published: true,
    },
  });

  console.log('✅ Created 4 properties');

  // Create leads
  const lead1 = await prisma.lead.create({
    data: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 555-0101',
      source: 'LANDING_PAGE',
      status: 'NEW',
      budgetMin: 800000,
      budgetMax: 900000,
      notes: 'Interested in downtown properties. Works in finance, needs quick commute.',
      assignedToId: agent.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      fullName: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 555-0102',
      source: 'REFERRAL',
      status: 'CONTACTED',
      budgetMin: 600000,
      budgetMax: 750000,
      notes: 'Looking for family home with good schools. Has 2 kids.',
      assignedToId: agent.id,
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      fullName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 555-0103',
      source: 'MANUAL',
      status: 'VIEWING_SCHEDULED',
      budgetMin: 1000000,
      budgetMax: 1500000,
      notes: 'High-end buyer. Looking for beachfront property.',
      assignedToId: admin.id,
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      fullName: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 555-0104',
      source: 'LANDING_PAGE',
      status: 'OFFER_MADE',
      budgetMin: 400000,
      budgetMax: 500000,
      notes: 'First-time buyer. Pre-approved for loan.',
      assignedToId: agent.id,
    },
  });

  const lead5 = await prisma.lead.create({
    data: {
      fullName: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 555-0105',
      source: 'OTHER',
      status: 'CLOSED',
      notes: 'Successfully closed on suburban home last month.',
      assignedToId: agent.id,
    },
  });

  const lead6 = await prisma.lead.create({
    data: {
      fullName: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      source: 'LANDING_PAGE',
      status: 'LOST',
      notes: 'Could not secure financing.',
    },
  });

  console.log('✅ Created 6 leads');

  // Create deals
  const deal1 = await prisma.deal.create({
    data: {
      leadId: lead1.id,
      propertyId: property1.id,
      stage: 'NEGOTIATION',
      offerPrice: 840000,
      commissionRate: 0.03,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      leadId: lead2.id,
      propertyId: property2.id,
      stage: 'NEGOTIATION',
      offerPrice: 665000,
      commissionRate: 0.025,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      leadId: lead3.id,
      propertyId: property3.id,
      stage: 'UNDER_CONTRACT',
      offerPrice: 1180000,
      expectedCloseDate: new Date('2025-01-15'),
      commissionRate: 0.03,
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      leadId: lead4.id,
      propertyId: property4.id,
      stage: 'UNDER_CONTRACT',
      offerPrice: 445000,
      expectedCloseDate: new Date('2025-01-20'),
      commissionRate: 0.03,
    },
  });

  const deal5 = await prisma.deal.create({
    data: {
      leadId: lead5.id,
      propertyId: property2.id,
      stage: 'CLOSED',
      offerPrice: 675000,
      closedPrice: 670000,
      commissionRate: 0.025,
    },
  });

  console.log('✅ Created 5 deals');

  // Create activities
  await prisma.activity.create({
    data: {
      leadId: lead1.id,
      propertyId: property1.id,
      dealId: deal1.id,
      userId: agent.id,
      type: 'VIEWING',
      content: 'Showed property to client. Very interested in the downtown location.',
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead1.id,
      userId: agent.id,
      type: 'CALL',
      content: 'Initial qualification call. Budget confirmed at $800-900k.',
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead2.id,
      userId: agent.id,
      type: 'EMAIL',
      content: 'Sent property listings matching their criteria. Waiting for response.',
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead3.id,
      propertyId: property3.id,
      userId: admin.id,
      type: 'MEETING',
      content: 'Met at beachfront property. Client loves the view and amenities.',
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead4.id,
      propertyId: property4.id,
      dealId: deal4.id,
      userId: agent.id,
      type: 'NOTE',
      content: 'Offer accepted! Moving to contract phase. Inspection scheduled for next week.',
    },
  });

  await prisma.activity.create({
    data: {
      propertyId: property1.id,
      userId: agent.id,
      type: 'NOTE',
      content: 'Updated property photos and description. Ready for marketing push.',
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead5.id,
      userId: agent.id,
      type: 'NOTE',
      content: 'Deal closed successfully! Client very happy with their new home.',
    },
  });

  console.log('✅ Created 7 activities');

  // Create form submissions
  await prisma.landingPageFormSubmission.create({
    data: {
      propertyId: property1.id,
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 555-0101',
      message: 'I would love to schedule a viewing of this beautiful loft!',
      leadId: lead1.id,
    },
  });

  await prisma.landingPageFormSubmission.create({
    data: {
      propertyId: property4.id,
      fullName: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 555-0104',
      message: 'Interested in this mountain property. Is it still available?',
      leadId: lead4.id,
    },
  });

  await prisma.landingPageFormSubmission.create({
    data: {
      propertyId: property1.id,
      fullName: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      message: 'Looking for more information about this property.',
      leadId: lead6.id,
    },
  });

  console.log('✅ Created 3 form submissions');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
