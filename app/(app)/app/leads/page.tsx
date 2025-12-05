import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";

async function getLeads() {
  return await prisma.lead.findMany({
    include: {
      assignedTo: true,
      _count: {
        select: { deals: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NEW: "default",
  CONTACTED: "secondary",
  VIEWING_SCHEDULED: "outline",
  OFFER_MADE: "secondary",
  CLOSED: "secondary",
  LOST: "destructive",
};

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage your prospects and track their journey
          </p>
        </div>
        <Link href="/app/leads/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No leads found. Create your first lead to get started.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/app/leads/${lead.id}`}
                        className="font-medium hover:underline"
                      >
                        {lead.fullName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{lead.email}</TableCell>
                    <TableCell className="text-sm">{lead.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[lead.status] || "default"}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{lead.source}</TableCell>
                    <TableCell className="text-sm">
                      {lead.budgetMin && lead.budgetMax
                        ? `${formatCurrency(lead.budgetMin)} - ${formatCurrency(lead.budgetMax)}`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.assignedTo?.name || "Unassigned"}
                    </TableCell>
                    <TableCell className="text-sm">{lead._count.deals}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(lead.createdAt)}
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
