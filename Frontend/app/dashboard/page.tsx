"use client"

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux" // Assumes you're using Redux
import {
  FileText,
  Search,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  X,
  Camera,
} from "lucide-react"
import Image from "next/image"

// Mock user data based on the schema (fallback data)
const mockUserData = {
  username: "john_doe",
  email: "john.doe@example.com",
  fullname: "John Doe",
  gender: "Male",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
  reportedCases: [
    { id: 1, title: "Missing Person Case #1", status: "Active", date: "2024-03-15" },
    { id: 2, title: "Missing Person Case #2", status: "Resolved", date: "2024-03-10" },
  ],
  missingCases: [
    { id: 1, title: "Search Case #1", location: "Mumbai", date: "2024-03-12" },
    { id: 2, title: "Search Case #2", location: "Delhi", date: "2024-03-08" },
  ],
}

function DashboardPage() {
  // Retrieve authenticated user from Redux store
  const loggedInUser = useSelector((state: { auth: { user: typeof mockUserData } }) => state.auth.user)
  // Use loggedInUser if present; otherwise, fallback to mock data.
  // console.log("loggedInUser", loggedInUser)
  const currentUser = loggedInUser || mockUserData

  // console.log("currentUser", currentUser);
  // console.log("avatar", currentUser.avatar);

  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser.fullname,
    email: currentUser.email,
    gender: currentUser.gender,
    avatar: currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
  })

  // When currentUser changes (e.g., after login), update the edited profile state
  useEffect(() => {
    setEditedProfile({
      fullname: currentUser.fullname,
      email: currentUser.email,
      gender: currentUser.gender,
      avatar: currentUser.avatar,
    })
  }, [currentUser])

  interface UserProfile {
    fullname: string;
    email: string;
    gender: string;
    avatar: string;
  }

  interface Case {
    id: number;
    title: string;
    date: string;
  }

  interface ReportedCase extends Case {
    status: string;
  }

  interface MissingCase extends Case {
    location: string;
  }

  interface User {
    username: string;
    email: string;
    fullname: string;
    gender: string;
    avatar: string;
    reportedCases: ReportedCase[];
    missingCases: MissingCase[];
  }

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user profile
    // console.log("Profile update:", editedProfile);
    setIsEditingProfile(false);
  };

  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
                      src={currentUser.avatar}
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
                          src={editedProfile.avatar}
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
                          onChange={(e) => {
                            // Handle image upload
                            const file = e.target.files?.[0]
                            if (file) {
                              // Here you would typically upload the image to your server
                              // and get back a URL
                              console.log("File selected:", file)
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
                  {(currentUser?.reportedCases?.length || 0) + (currentUser?.missingCases?.length || 0)}
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
                  {(currentUser?.reportedCases?.length) || 0}
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
                  {(currentUser?.reportedCases?.filter((c) => c.status === "Resolved")?.length) || ""}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Missing Cases</p>
                <p className="text-2xl font-bold">{(currentUser?.missingCases?.length || 0)}</p>
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
                {/* <div className="space-y-4">
                  {[...currentUser?.reportedCases, ...currentUser?.missingCases]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((case_, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {"status" in case_ ? (
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          ) : (
                            <Search className="h-6 w-6 text-purple-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{(case_?.title) || ""}</p>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(case_.date).toLocaleDateString()}
                            </span>
                            {"location" in case_ && (
                              <>
                                <MapPin className="h-4 w-4 text-gray-400 ml-4" />
                                <span className="ml-2 text-sm text-gray-500">{(case_?.location || "Unknown")}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div> */}
              </div>
            )}

            {activeTab === "reported" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Reported Cases</h3>
                <div className="space-y-4">
                  {currentUser.reportedCases.map((case_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{(case_?.title) || ""}</p>
                          <p className="text-sm text-gray-500">{(new Date(case_?.date).toLocaleDateString() || "")}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          case_.status === "Active"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {case_.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "missing" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Missing Cases</h3>
                <div className="space-y-4">
                  {currentUser.missingCases.map((case_, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Search className="h-6 w-6 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{(case_?.title || "") }</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">{(case_?.location || "")}</span>
                          <Calendar className="h-4 w-4 text-gray-400 ml-4" />
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(case_.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
