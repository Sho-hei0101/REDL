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

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Generate slug from title
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const data = {
      title: formData.get("title"),
      slug,
      address: formData.get("address"),
      city: formData.get("city"),
      country: formData.get("country"),
      price: Number(formData.get("price")),
      status: formData.get("status"),
      mainImageUrl: formData.get("mainImageUrl"),
      gallery: formData.get("gallery") || undefined,
      beds: formData.get("beds") ? Number(formData.get("beds")) : undefined,
      baths: formData.get("baths") ? Number(formData.get("baths")) : undefined,
      areaSqm: formData.get("areaSqm") ? Number(formData.get("areaSqm")) : undefined,
      description: formData.get("description"),
      published: formData.get("published") === "true",
    };

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      toast.success("Property created successfully");
      router.push("/app/properties");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create property");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/properties">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Property</h1>
          <p className="text-muted-foreground">Add a new listing to your portfolio</p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input id="title" name="title" required placeholder="Modern Downtown Loft" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" required defaultValue="USA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input id="price" name="price" type="number" min="0" step="1000" required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beds">Bedrooms</Label>
                <Input id="beds" name="beds" type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baths">Bathrooms</Label>
                <Input id="baths" name="baths" type="number" min="0" step="0.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaSqm">Area (sqm)</Label>
                <Input id="areaSqm" name="areaSqm" type="number" min="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select id="status" name="status" required defaultValue="ACTIVE">
                  <option value="ACTIVE">Active</option>
                  <option value="UNDER_CONTRACT">Under Contract</option>
                  <option value="SOLD">Sold</option>
                  <option value="OFF_MARKET">Off Market</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="published">Landing Page Published *</Label>
                <Select id="published" name="published" required defaultValue="true">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainImageUrl">Main Image URL *</Label>
              <Input 
                id="mainImageUrl" 
                name="mainImageUrl" 
                type="url" 
                required 
                placeholder="https://images.unsplash.com/photo-..." 
              />
              <p className="text-xs text-muted-foreground">Use Unsplash or any image hosting service</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery URLs</Label>
              <Input 
                id="gallery" 
                name="gallery" 
                placeholder="https://image1.jpg,https://image2.jpg,https://image3.jpg"
              />
              <p className="text-xs text-muted-foreground">Comma-separated list of image URLs</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Describe the property features, location benefits, and highlights..."
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Property"}
              </Button>
              <Link href="/app/properties">
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
