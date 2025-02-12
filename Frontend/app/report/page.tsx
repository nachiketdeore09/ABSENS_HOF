"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Camera } from "lucide-react";
import Image from "next/image";

export default function ReportPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="container max-w-7xl px-4 sm:px-6 lg:px-40 py-10">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Report Missing Person</h1>
          <p className="text-muted-foreground mt-2">
            Please provide as much information as possible to help locate the missing person.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="Enter age" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" placeholder="Enter gender" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Last Seen Information</h2>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="lastLocation">Last Known Location</Label>
                <Input id="lastLocation" placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastDate">Date Last Seen</Label>
                <Input id="lastDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description including height, weight, clothing, and any distinguishing features"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Photos</h2>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Recent Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                    >
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          className="w-160 h-160 object-cover rounded-lg"
                          height={160}
                          width={160}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload photo</p>
                        </div>
                      )}
                      <input
                        id="photo"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person Name</Label>
                <Input id="contactName" placeholder="Enter contact name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input id="contactPhone" type="tel" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" type="email" placeholder="Enter email address" />
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full">
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  );
}