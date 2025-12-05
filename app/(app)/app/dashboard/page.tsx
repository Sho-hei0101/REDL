import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

async function getDashboardData() {
  const [
    totalLeads,
    activeLeads,
    deals,
    activities,
    leadsByStatus,
    dealsByStage,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: { notIn: ["CLOSED", "LOST"] } } }),
    prisma.deal.findMany({
      include: {
        lead: true,
        property: true,
      },
    }),
    prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        lead: true,
        property: true,
        deal: true,
      },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      _count: true,
    }),
  ]);

  const totalPipelineValue = deals
    .filter((d) => d.stage !== "CLOSED" && d.stage !== "FALLTHROUGH")
    .reduce((sum, d) => sum + (d.offerPrice || 0) * (d.commissionRate || 0.03), 0);

  const closedDeals = deals.filter((d) => d.stage === "CLOSED");
  const closedThisMonth = closedDeals.filter((d) => {
    const closedDate = new Date(d.updatedAt);
    const now = new Date();
    return (
      closedDate.getMonth() === now.getMonth() &&
      closedDate.getFullYear() === now.getFullYear()
    );
  });

  return {
    totalLeads,
    activeLeads,
    totalPipelineValue,
    closedThisMonth: closedThisMonth.length,
    leadsByStatus,
    dealsByStage,
    activities,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your real estate pipeline overview.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeLeads}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalLeads} total leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalPipelineValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Potential commission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals This Month</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.closedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Closed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalLeads > 0
                ? Math.round((data.closedThisMonth / data.totalLeads) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Leads by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
            <CardDescription>Current lead distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.leadsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.status}</span>
                  <Badge variant="secondary">{item._count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deals by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
            <CardDescription>Deal pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.dealsByStage.map((item) => (
                <div key={item.stage} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.stage}</span>
                  <Badge variant="secondary">{item._count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start border-b pb-4 last:border-0">
                <Badge variant="outline" className="mt-1">
                  {activity.type}
                </Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.content}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{activity.user.name}</span>
                    {activity.lead && (
                      <>
                        <span>•</span>
                        <Link
                          href={`/app/leads/${activity.leadId}`}
                          className="hover:underline"
                        >
                          {activity.lead.fullName}
                        </Link>
                      </>
                    )}
                    {activity.property && (
                      <>
                        <span>•</span>
                        <Link
                          href={`/app/properties/${activity.propertyId}`}
                          className="hover:underline"
                        >
                          {activity.property.title}
                        </Link>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatDateTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
