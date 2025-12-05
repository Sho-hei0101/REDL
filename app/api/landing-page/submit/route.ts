import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submissionSchema = z.object({
  propertyId: z.string(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = submissionSchema.parse(body);

    // Check if lead already exists
    let lead = await prisma.lead.findFirst({
      where: { email: validated.email },
    });

    // Create lead if doesn't exist
    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          fullName: validated.fullName,
          email: validated.email,
          phone: validated.phone,
          source: "LANDING_PAGE",
          status: "NEW",
        },
      });
    }

    // Create form submission
    const submission = await prisma.landingPageFormSubmission.create({
      data: {
        propertyId: validated.propertyId,
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        message: validated.message,
        leadId: lead.id,
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
