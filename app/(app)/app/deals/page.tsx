import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

async function getDeals() {
  return await prisma.deal.findMany({
    include: {
      lead: true,
      property: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

const stageColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NEGOTIATION: "default",
  UNDER_CONTRACT: "secondary",
  CLOSED: "outline",
  FALLTHROUGH: "destructive",
};

export default async function DealsPage() {
  const deals = await getDeals();

  const totalPotentialCommission = deals
    .filter(d => d.stage !== "CLOSED" && d.stage !== "FALLTHROUGH")
    .reduce((sum, d) => sum + (d.offerPrice || 0) * (d.commissionRate || 0.03), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground">
            Track your property deals and commission pipeline
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
          <p className="text-2xl font-bold">{formatCurrency(totalPotentialCommission)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deals ({deals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Offer Price</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Est. Commission</TableHead>
                <TableHead>Expected Close</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No deals found yet.
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/app/properties/${deal.propertyId}`}
                        className="font-medium hover:underline"
                      >
                        {deal.property.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/app/leads/${deal.leadId}`}
                        className="hover:underline"
                      >
                        {deal.lead.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stageColors[deal.stage] || "default"}>
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {deal.offerPrice ? formatCurrency(deal.offerPrice) : "-"}
                    </TableCell>
                    <TableCell>
                      {deal.commissionRate ? `${(deal.commissionRate * 100).toFixed(1)}%` : "-"}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {deal.offerPrice && deal.commissionRate
                        ? formatCurrency(deal.offerPrice * deal.commissionRate)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : "-"}
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
