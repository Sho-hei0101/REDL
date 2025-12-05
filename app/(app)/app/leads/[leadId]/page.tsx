import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, DollarSign } from "lucide-react";

async function getLead(leadId: string) {
  return await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedTo: true,
      deals: {
        include: {
          property: true,
        },
      },
      activities: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      formSubmissions: {
        include: {
          property: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const lead = await getLead(leadId);

  if (!lead) {
    notFound();
  }

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    NEW: "default",
    CONTACTED: "secondary",
    VIEWING_SCHEDULED: "outline",
    OFFER_MADE: "secondary",
    CLOSED: "secondary",
    LOST: "destructive",
  };

  const stageColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    NEGOTIATION: "default",
    UNDER_CONTRACT: "secondary",
    CLOSED: "outline",
    FALLTHROUGH: "destructive",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/leads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{lead.fullName}</h1>
          <p className="text-muted-foreground">Lead Details</p>
        </div>
        <Badge variant={statusColors[lead.status] || "default"} className="text-sm">
          {lead.status}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">{lead.email}</p>
              {lead.phone && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Range</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {lead.budgetMin && lead.budgetMax ? (
              <div className="text-sm">
                <p className="font-medium">{formatCurrency(lead.budgetMin)}</p>
                <p className="text-muted-foreground">to {formatCurrency(lead.budgetMax)}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not specified</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Source:</span>{" "}
                <span className="font-medium">{lead.source}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Assigned to:</span>{" "}
                <span className="font-medium">{lead.assignedTo?.name || "Unassigned"}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">Deals ({lead.deals.length})</TabsTrigger>
          <TabsTrigger value="activities">Activities ({lead.activities.length})</TabsTrigger>
          <TabsTrigger value="submissions">Form Submissions ({lead.formSubmissions.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{lead.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{lead.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusColors[lead.status] || "default"}>{lead.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium">{lead.source}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
              {lead.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm whitespace-pre-line bg-muted p-3 rounded-md">
                    {lead.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>Associated Deals</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.deals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No deals associated with this lead yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Offer Price</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lead.deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <Link
                            href={`/app/properties/${deal.propertyId}`}
                            className="font-medium hover:underline"
                          >
                            {deal.property.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={stageColors[deal.stage] || "default"}>
                            {deal.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {deal.offerPrice ? formatCurrency(deal.offerPrice) : "-"}
                        </TableCell>
                        <TableCell>
                          {deal.offerPrice && deal.commissionRate
                            ? formatCurrency(deal.offerPrice * deal.commissionRate)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(deal.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No activities recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {lead.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-4 items-start border-b pb-4 last:border-0"
                    >
                      <Badge variant="outline" className="mt-1">
                        {activity.type}
                      </Badge>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.content}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{activity.user.name}</span>
                          <span>•</span>
                          <span>{formatDateTime(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.formSubmissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No form submissions from landing pages.
                </p>
              ) : (
                <div className="space-y-4">
                  {lead.formSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/app/properties/${submission.propertyId}`}
                            className="font-medium hover:underline"
                          >
                            {submission.property.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(submission.createdAt)}
                          </p>
                        </div>
                      </div>
                      {submission.message && (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {submission.message}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Contact: {submission.phone || "No phone"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
