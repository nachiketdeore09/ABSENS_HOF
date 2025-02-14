"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Camera, X } from "lucide-react";
import Image from "next/image";

export default function FindPage() {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    lastSeenLocation: "",
    missingDate: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("You must be logged in to submit a report.");
      return;
    }

    const reportData = new FormData();
    reportData.append("name", `${formData.firstName} ${formData.lastName}`);
    reportData.append("age", formData.age);
    reportData.append("gender", formData.gender);
    reportData.append("missingDate", formData.missingDate);
    reportData.append("lastSeenLocation", formData.lastSeenLocation);
    reportData.append("description", formData.description);

    selectedFiles.forEach((file) => {
      reportData.append("photos", file);
    });

    try {
      const response = await fetch("http://localhost:5000/api/v1/missing-persons/", {
        method: "POST",
        body: reportData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Raw Response:", response);
      const data = await response.json();

      if (response.ok) {
        alert("Missing person report submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          age: "",
          gender: "",
          lastSeenLocation: "",
          missingDate: "",
          description: "",
        });
        setPreviewUrls([]);
        setSelectedFiles([]);
      } else {
        alert(data || "Failed to submit report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container max-w-7xl px-4 sm:px-6 lg:px-40 py-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Find Missing Person</h1>
          <p className="text-muted-foreground mt-2">Please provide as much information as possible.</p>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input id="firstName" placeholder="First Name" onChange={handleChange} />
            <Input id="lastName" placeholder="Last Name" onChange={handleChange} />
            <Input id="age" type="number" placeholder="Age" onChange={handleChange} />
            <Input id="gender" placeholder="Gender" onChange={handleChange} />
          </div>
        </div>

        {/* Last Seen Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Last Seen Information</h2>
          <Input id="lastSeenLocation" placeholder="Last Known Location" onChange={handleChange} />
          <Input id="missingDate" type="date" onChange={handleChange} />
          <Textarea id="description" placeholder="Description..." rows={4} onChange={handleChange} />
        </div>

        {/* Photo Upload */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Photos</h2>
          <div className="flex flex-wrap gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image src={url} alt="Preview" layout="fill" objectFit="cover" className="rounded-lg" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-4 cursor-pointer border-2 border-dashed p-4 rounded-lg hover:bg-muted/50">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span>Click to upload photos</span>
            <input id="photo" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Submit Report
        </Button>
      </form>
    </div>
  );
}
