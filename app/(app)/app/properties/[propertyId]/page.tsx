import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Building2, Bed, Bath, Maximize } from "lucide-react";

async function getProperty(propertyId: string) {
  return await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      deals: {
        include: {
          lead: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      formSubmissions: {
        include: {
          lead: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const property = await getProperty(propertyId);

  if (!property) {
    notFound();
  }

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    ACTIVE: "default",
    UNDER_CONTRACT: "secondary",
    SOLD: "outline",
    OFF_MARKET: "destructive",
  };

  const galleryImages = property.gallery
    ? property.gallery.split(",").map((url) => url.trim())
    : [property.mainImageUrl];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/properties">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
          <p className="text-muted-foreground">
            {property.city}, {property.country}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColors[property.status] || "default"} className="text-sm">
            {property.status}
          </Badge>
          {property.published && (
            <Link href={`/p/${property.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Image & Key Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            <div
              className="aspect-video bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${property.mainImageUrl})` }}
            />
            <div className="p-6 space-y-4">
              <div>
                <p className="text-3xl font-bold">{formatCurrency(property.price)}</p>
                <p className="text-muted-foreground">{property.address}</p>
              </div>
              <div className="flex gap-4 text-sm">
                {property.beds && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>{property.beds} beds</span>
                  </div>
                )}
                {property.baths && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span>{property.baths} baths</span>
                  </div>
                )}
                {property.areaSqm && (
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <span>{property.areaSqm} sqm</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={statusColors[property.status] || "default"}>
                  {property.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-medium">{property.published ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-mono text-sm">{property.slug}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(property.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm whitespace-pre-line">{property.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery */}
      {galleryImages.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, idx) => (
                <div
                  key={idx}
                  className="aspect-video bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deals">Deals ({property.deals.length})</TabsTrigger>
          <TabsTrigger value="submissions">
            Form Submissions ({property.formSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="landing">Landing Page Settings</TabsTrigger>
        </TabsList>

        {/* Deals Tab */}
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>Associated Deals</CardTitle>
            </CardHeader>
            <CardContent>
              {property.deals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No deals for this property yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {property.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Link
                          href={`/app/leads/${deal.leadId}`}
                          className="font-medium hover:underline"
                        >
                          {deal.lead.fullName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {deal.lead.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge>{deal.stage}</Badge>
                        {deal.offerPrice && (
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(deal.offerPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {property.formSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No form submissions yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {property.formSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{submission.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.email}
                          </p>
                          {submission.phone && (
                            <p className="text-sm text-muted-foreground">
                              {submission.phone}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {formatDate(submission.createdAt)}
                          {submission.lead && (
                            <div className="mt-1">
                              <Link
                                href={`/app/leads/${submission.leadId}`}
                                className="text-primary hover:underline"
                              >
                                View Lead
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      {submission.message && (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {submission.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landing Page Settings Tab */}
        <TabsContent value="landing">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Public URL</p>
                  {property.published ? (
                    <Link
                      href={`/p/${property.slug}`}
                      target="_blank"
                      className="text-sm font-mono text-primary hover:underline flex items-center gap-1"
                    >
                      /p/{property.slug} <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not published</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="font-medium">{property.published ? "Yes" : "No"}</p>
                </div>
              </div>

              {property.heroTitle && (
                <div>
                  <p className="text-sm text-muted-foreground">Hero Title</p>
                  <p className="font-medium">{property.heroTitle}</p>
                </div>
              )}

              {property.heroSubtitle && (
                <div>
                  <p className="text-sm text-muted-foreground">Hero Subtitle</p>
                  <p className="font-medium">{property.heroSubtitle}</p>
                </div>
              )}

              {property.ctaText && (
                <div>
                  <p className="text-sm text-muted-foreground">CTA Button Text</p>
                  <p className="font-medium">{property.ctaText}</p>
                </div>
              )}

              {property.metaTitle && (
                <div>
                  <p className="text-sm text-muted-foreground">SEO Meta Title</p>
                  <p className="font-medium">{property.metaTitle}</p>
                </div>
              )}

              {property.metaDescription && (
                <div>
                  <p className="text-sm text-muted-foreground">SEO Meta Description</p>
                  <p className="text-sm">{property.metaDescription}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  In a production version, these settings would be editable through a form.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
