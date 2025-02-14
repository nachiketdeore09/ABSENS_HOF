"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import {
  FileText,
  Search,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  X,
  Camera,
} from "lucide-react";
import Image from "next/image";

// Define interfaces for reported and missing cases based on your data structure
interface ReportedCase {
  _id: string;
  name: string;
  location: string;
  status: string;
  createdAt: string;
  description: string;
  photos: string[];
}

interface MissingCase {
  _id: string;
  name: string;
  age: number;
  gender: string;
  createdAt: string;
  missingDate: string;
  description: string;
  lastSeenLocation: string;
  photos: string[];
  status: string;
}

// Define interface for the User object
interface User {
  username: string;
  email: string;
  fullname: string;
  gender: string;
  avatar: string;
  createdAt: string;
  reportedCases: ReportedCase[];
  missingCases: MissingCase[];
}

// Create a fallback/mock user data object that matches the User interface
const mockUserData: User = {
  username: "manu",
  email: "manu@gmail.com",
  fullname: "manish",
  gender: "Others",
  avatar: "",
  createdAt: "2025-02-11T23:21:17.868Z",
  reportedCases: [
    {
      _id: "67af50f1e89e03bf4c10f4d4",
      name: "Unknown",
      location: "Lucknow",
      status: "pending",
      createdAt: "2025-02-14T14:19:29.688Z",
      description: "sldkvjhbsjkanhj",
      photos: [
        "https://res.cloudinary.com/dlhgzwwdx/image/upload/v1739542768/Absens_HOF/x6oe6q54wgfhofgpeigj.jpg",
      ],
    },
  ],
  missingCases: [
    {
      _id: "67af51a1e89e03bf4c10f4d9",
      name: "Manish Kumar",
      age: 18,
      gender: "Male",
      createdAt: "2025-02-14T14:22:25.224Z",
      missingDate: "2025-02-06T00:00:00.000Z",
      description: "No description provided",
      lastSeenLocation: "Lucknow",
      photos: [
        "https://res.cloudinary.com/dlhgzwwdx/image/upload/v1739542944/Absens_HOF/hn7tnhhpeurssuhmwjgk.jpg",
      ],
      status: "missing",
    },
  ],
};

// Define the shape of your Redux state (adjust as needed)
interface RootState {
  auth: {
    user: User | null;
  };
}

// Define an interface for the editable profile portion of the user
interface UserProfile {
  fullname: string;
  email: string;
  gender: string;
  avatar: string;
}

const DashboardPage: React.FC = () => {
  // Retrieve authenticated user from Redux store; fallback to mockUserData if not available
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const currentUser: User = loggedInUser || mockUserData;

  // Local state for active tab and profile editing
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    fullname: currentUser.fullname,
    email: currentUser.email,
    gender: currentUser.gender,
    avatar:
      currentUser.avatar ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
  });

  useEffect(() => {
    setEditedProfile({
      fullname: currentUser.fullname,
      email: currentUser.email,
      gender: currentUser.gender,
      avatar:
        currentUser.avatar ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    });
  }, [currentUser]);

  // Handler for updating the profile
  const handleProfileUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Typically, make an API call here to update the user profile
    console.log("Updated profile:", editedProfile);
    setIsEditingProfile(false);
  };

  // Handler for input changes in the profile form
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            {!isEditingProfile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <Image
                      src={
                        currentUser.avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80"
                      }
                      alt={currentUser.fullname}
                      className="h-24 w-24 rounded-full object-cover"
                      height={96}
                      width={96}
                    />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentUser.fullname}
                    </h2>
                    <p className="text-gray-600">@{currentUser.username}</p>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <div className="mt-2 flex items-center">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {currentUser.gender}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Member since:{" "}
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
                <form onSubmit={handleProfileUpdate} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="relative">
                        <Image
                          src={
                            editedProfile.avatar ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80"
                          }
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover"
                          height={96}
                          width={96}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700"
                        >
                          <Camera className="h-4 w-4" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Handle image upload here (e.g., call your API)
                              console.log("File selected:", file);
                            }
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Click the camera icon to update your photo
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="fullname"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          value={editedProfile.fullname}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedProfile.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={editedProfile.gender}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold">
                  {currentUser.reportedCases.length +
                    currentUser.missingCases.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold">
                  {
                    currentUser.reportedCases.filter(
                      (c) => c.status.toLowerCase() === "pending"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Resolved Cases</p>
                <p className="text-2xl font-bold">
                  {
                    currentUser.reportedCases.filter(
                      (c) => c.status.toLowerCase() === "resolved"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Missing Cases</p>
                <p className="text-2xl font-bold">
                  {currentUser.missingCases.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "overview"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("reported")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "reported"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reported Cases
              </button>
              <button
                onClick={() => setActiveTab("missing")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "missing"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Missing Cases
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                {/* Optionally, combine both reported and missing cases for recent activity */}
              </div>
            )}

            {activeTab === "reported" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Reported Cases</h3>
                <div className="space-y-4">
                  {currentUser.reportedCases.map((caseItem) => (
                    <div
                      key={caseItem._id}
                      className="p-4 bg-gray-50 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          <p className="text-sm font-medium text-gray-900">
                            {caseItem.name}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            caseItem.status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Reported on:{" "}
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">
                        {caseItem.description}
                      </p>
                      <p className="mt-2 text-gray-600">
                        <strong>Location: </strong>
                        {caseItem.location}
                      </p>
                      {caseItem.photos.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                          {caseItem.photos.map((photo, index) => (
                            <Image
                              key={index}
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="h-16 w-16 rounded object-cover"
                              height={64}
                              width={64}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "missing" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Missing Cases</h3>
                <div className="space-y-4">
                  {currentUser.missingCases.map((caseItem) => (
                    <div
                      key={caseItem._id}
                      className="p-4 bg-gray-50 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Search className="h-6 w-6 text-purple-500" />
                          <p className="text-sm font-medium text-gray-900">
                            {caseItem.name}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          {caseItem.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Missing Date:{" "}
                        {new Date(caseItem.missingDate).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">
                        {caseItem.description}
                      </p>
                      <p className="mt-2 text-gray-600">
                        <strong>Last Seen: </strong>
                        {caseItem.lastSeenLocation}
                      </p>
                      <p className="mt-2 text-gray-600">
                        <strong>Age: </strong>
                        {caseItem.age}
                      </p>
                      <p className="mt-2 text-gray-600">
                        <strong>Gender: </strong>
                        {caseItem.gender}
                      </p>
                      {caseItem.photos.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                          {caseItem.photos.map((photo, index) => (
                            <Image
                              key={index}
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="h-16 w-16 rounded object-cover"
                              height={64}
                              width={64}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
