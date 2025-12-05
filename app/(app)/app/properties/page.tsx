import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";

async function getProperties() {
  return await prisma.property.findMany({
    include: {
      _count: {
        select: { deals: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  UNDER_CONTRACT: "secondary",
  SOLD: "outline",
  OFF_MARKET: "destructive",
};

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your property listings and landing pages
          </p>
        </div>
        <Link href="/app/properties/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties ({properties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Beds/Baths</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Public Page</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No properties found. Create your first property to get started.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/app/properties/${property.id}`}
                        className="font-medium hover:underline"
                      >
                        {property.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{property.city}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatCurrency(property.price)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.beds && property.baths
                        ? `${property.beds} bed / ${property.baths} bath`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[property.status] || "default"}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{property._count.deals}</TableCell>
                    <TableCell>
                      {property.published ? (
                        <Link
                          href={`/p/${property.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not published</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(property.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
