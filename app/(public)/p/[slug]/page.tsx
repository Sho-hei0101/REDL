import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import PropertyContactForm from "./contact-form";
import Image from "next/image";

async function getProperty(slug: string) {
  const property = await prisma.property.findUnique({
    where: { slug },
  });

  if (!property || !property.published || property.status === "OFF_MARKET") {
    return null;
  }

  return property;
}

export default async function PropertyLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  const galleryImages = property.gallery
    ? property.gallery.split(",").map((url) => url.trim())
    : [property.mainImageUrl];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${property.mainImageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-20">
          <div className="text-white space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              {property.heroTitle || property.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              {property.heroSubtitle ||
                `${property.address}, ${property.city}, ${property.country}`}
            </p>
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{formatCurrency(property.price)}</span>
              </div>
              {property.beds && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  <span>{property.beds} Beds</span>
                </div>
              )}
              {property.baths && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5" />
                  <span>{property.baths} Baths</span>
                </div>
              )}
              {property.areaSqm && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5" />
                  <span>{property.areaSqm} sqm</span>
                </div>
              )}
            </div>
            <a href="#contact">
              <Button size="lg" className="mt-4">
                {property.ctaText || "Schedule a Viewing"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 1 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.slice(0, 6).map((image, idx) => (
              <div
                key={idx}
                className="aspect-video bg-cover bg-center rounded-lg shadow-md hover:shadow-xl transition-shadow"
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Description Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">About This Property</h2>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>
      </section>

      {/* Key Details */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-xl font-bold">{formatCurrency(property.price)}</p>
                </div>
                {property.beds && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="text-xl font-bold">{property.beds}</p>
                  </div>
                )}
                {property.baths && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="text-xl font-bold">{property.baths}</p>
                  </div>
                )}
                {property.areaSqm && (
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="text-xl font-bold">{property.areaSqm} sqm</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {property.address}, {property.city}, {property.country}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Interested in This Property?</h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you shortly
            </p>
          </div>
          <PropertyContactForm propertyId={property.id} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Real Estate CRM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
