"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [searchResults] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 12,
      lastSeen: "2024-03-15",
      location: "Prayagraj, Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 8,
      lastSeen: "2024-03-16",
      location: "Varanasi, Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1555009393-a50dadde3b64?w=150&h=150&fit=crop"
    }
  ]);

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Missing Persons</h1>
          <p className="text-muted-foreground mt-2">
            Search our database using facial recognition or manual filters
          </p>
        </div>

        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="photo">Search by Photo</TabsTrigger>
            <TabsTrigger value="filters">Search by Filters</TabsTrigger>
          </TabsList>
          <TabsContent value="photo" className="space-y-4">
            <div className="mt-6">
              <label 
                htmlFor="searchPhoto" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-12 w-12 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG (MAX. 10MB)
                  </p>
                </div>
                <input id="searchPhoto" type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </TabsContent>
          <TabsContent value="filters" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="searchName">Name</Label>
                <Input id="searchName" placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchAge">Age</Label>
                <Input id="searchAge" type="number" placeholder="Enter age" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchLocation">Location</Label>
                <Input id="searchLocation" placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchDate">Date Range</Label>
                <Input id="searchDate" type="date" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Button size="lg" className="gap-2">
            <SearchIcon className="h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Search Results</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className={cn(
                  "flex gap-4 p-4 rounded-lg border",
                  "hover:bg-muted/50 transition-colors"
                )}
              >
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="space-y-1">
                  <h3 className="font-semibold">{result.name}</h3>
                  <p className="text-sm text-muted-foreground">Age: {result.age}</p>
                  <p className="text-sm text-muted-foreground">
                    Last seen: {new Date(result.lastSeen).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.location}</p>
                  <Button variant="link" className="p-0 h-auto">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}