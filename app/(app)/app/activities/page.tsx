import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

async function getActivities() {
  return await prisma.activity.findMany({
    include: {
      user: true,
      lead: true,
      property: true,
      deal: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground">
          Complete activity log across all leads, properties, and deals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activities recorded yet.
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 items-start border-b pb-4 last:border-0"
                >
                  <Badge variant="outline" className="mt-1 shrink-0">
                    {activity.type}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.content}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{activity.user.name}</span>
                      {activity.lead && (
                        <>
                          <span>•</span>
                          <Link
                            href={`/app/leads/${activity.leadId}`}
                            className="hover:underline text-primary"
                          >
                            Lead: {activity.lead.fullName}
                          </Link>
                        </>
                      )}
                      {activity.property && (
                        <>
                          <span>•</span>
                          <Link
                            href={`/app/properties/${activity.propertyId}`}
                            className="hover:underline text-primary"
                          >
                            Property: {activity.property.title}
                          </Link>
                        </>
                      )}
                      {activity.deal && activity.dealId && (
                        <>
                          <span>•</span>
                          <span>Deal #{activity.dealId.slice(0, 8)}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatDateTime(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
