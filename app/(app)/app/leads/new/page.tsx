"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      source: formData.get("source"),
      status: formData.get("status"),
      budgetMin: formData.get("budgetMin") ? Number(formData.get("budgetMin")) : undefined,
      budgetMax: formData.get("budgetMax") ? Number(formData.get("budgetMax")) : undefined,
      notes: formData.get("notes") || undefined,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      toast.success("Lead created successfully");
      router.push("/app/leads");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create lead");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/leads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Lead</h1>
          <p className="text-muted-foreground">Add a new prospect to your pipeline</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" name="fullName" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source *</Label>
                <Select id="source" name="source" required>
                  <option value="LANDING_PAGE">Landing Page</option>
                  <option value="MANUAL">Manual</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select id="status" name="status" required defaultValue="NEW">
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                  <option value="OFFER_MADE">Offer Made</option>
                  <option value="CLOSED">Closed</option>
                  <option value="LOST">Lost</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Budget Min</Label>
                <Input
                  id="budgetMin"
                  name="budgetMin"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetMax">Budget Max</Label>
                <Input
                  id="budgetMax"
                  name="budgetMax"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional information about this lead..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Lead"}
              </Button>
              <Link href="/app/leads">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
