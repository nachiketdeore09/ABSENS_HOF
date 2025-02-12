"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Upload, Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
    missingDate: "",
    lastSeenLocation: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...newUrls]);
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoUrls[index]);
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    photos.forEach(photo => {
      formDataToSend.append('photos', photo);
    });

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch('/api/missing-persons', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit');

      setFormData({
        name: "",
        age: "",
        gender: "",
        description: "",
        missingDate: "",
        lastSeenLocation: "",
      });
      setPhotos([]);
      setPhotoUrls([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Find Missing Person</h1>
          <p className="text-muted-foreground mt-2">Please provide as much information as possible to help locate the person.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="missingDate">Missing Date *</Label>
                <Input id="missingDate" name="missingDate" type="date" value={formData.missingDate} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastSeenLocation">Last Seen Location *</Label>
                <Input id="lastSeenLocation" name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Please provide any additional details that might help identify the person" className="h-32" />
            </div>

            <div className="space-y-2">
              <Label>Photos *</Label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Uploaded photo ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                    <button type="button" onClick={() => removePhoto(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="photos" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG (MAX. 10MB)</p>
                </div>
                <input id="photos" type="file" className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} required={photos.length === 0} />
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="lg">Submit Report</Button>
          </div>
        </form>
      </div>
    </div>
  );
}









// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Upload, Search as SearchIcon, X } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function SearchPage() {
//   const [photos, setPhotos] = useState<File[]>([]);
//   const [photoUrls, setPhotoUrls] = useState<string[]>([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     description: "",
//     missingDate: "",
//     lastSeenLocation: "",
//     status: "missing",
//   });

//   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     // Create URLs for preview
//     const newUrls = files.map(file => URL.createObjectURL(file));
//     setPhotoUrls(prev => [...prev, ...newUrls]);
//     setPhotos(prev => [...prev, ...files]);
//   };

//   const removePhoto = (index: number) => {
//     URL.revokeObjectURL(photoUrls[index]); // Clean up URL
//     setPhotoUrls(prev => prev.filter((_, i) => i !== index));
//     setPhotos(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     photos.forEach(photo => {
//       formDataToSend.append('photos', photo);
//     });

//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSend.append(key, value);
//     });

//     try {
//       // Replace with your API endpoint
//       const response = await fetch('/api/missing-persons', {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (!response.ok) throw new Error('Failed to submit');

//       // Reset form after successful submission
//       setFormData({
//         name: "",
//         age: "",
//         gender: "",
//         description: "",
//         missingDate: "",
//         lastSeenLocation: "",
//         status: "missing",
//       });
//       setPhotos([]);
//       setPhotoUrls([]);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   return (
//     <div className="container py-10">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight">Find Missing Person</h1>
//           <p className="text-muted-foreground mt-2">Please provide as much information as possible to help locate the person.

//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name *</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="age">Age *</Label>
//                 <Input
//                   id="age"
//                   name="age"
//                   type="number"
//                   value={formData.age}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="gender">Gender</Label>
//                 <Select
//                   value={formData.gender}
//                   onValueChange={(value) => handleSelectChange('gender', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select gender" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="male">Male</SelectItem>
//                     <SelectItem value="female">Female</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select
//                   value={formData.status}
//                   onValueChange={(value) => handleSelectChange('status', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="missing">Missing</SelectItem>
//                     <SelectItem value="found">Found</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="missingDate">Missing Date *</Label>
//                 <Input
//                   id="missingDate"
//                   name="missingDate"
//                   type="date"
//                   value={formData.missingDate}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastSeenLocation">Last Seen Location *</Label>
//                 <Input
//                   id="lastSeenLocation"
//                   name="lastSeenLocation"
//                   value={formData.lastSeenLocation}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Please provide any additional details that might help identify the person"
//                 className="h-32"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Photos *</Label>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 {photoUrls.map((url, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={url}
//                       alt={`Uploaded photo ${index + 1}`}
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removePhoto(index)}
//                       className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <label
//                 htmlFor="photos"
//                 className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
//               >
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
//                   <p className="text-sm text-muted-foreground">
//                     <span className="font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     JPG, PNG (MAX. 10MB)
//                   </p>
//                 </div>
//                 <input
//                   id="photos"
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   multiple
//                   onChange={handlePhotoUpload}
//                   required={photos.length === 0}
//                 />
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button type="submit" size="lg">
//               Submit Report
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



