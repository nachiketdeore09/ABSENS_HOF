"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  User,
  FileText,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [activeReports] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      status: "Active",
      date: "2024-03-15",
      location: "Prayagraj",
      matches: 2,
    },
    {
      id: 2,
      name: "Priya Singh",
      status: "Found",
      date: "2024-03-10",
      location: "Varanasi",
      matches: 1,
    },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "Match Found",
      description: "Potential match found for case #MP2024-156",
      date: "2024-03-17T14:30:00",
    },
    {
      id: 2,
      type: "Report Updated",
      description: "Added new photo to case #MP2024-157",
      date: "2024-03-17T13:15:00",
    },
  ]);

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, manage your reports and activities
            </p>
          </div>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 text-${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-7">
          {/* Reports List */}
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reports</CardTitle>
                <CardDescription>
                  Manage and track your missing person reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.location} • {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-sm ${
                          report.status === "Active" ? "text-orange-500" : "text-green-500"
                        }`}>
                          {report.status}
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-4 p-4 border rounded-lg"
                    >
                      <div className="mt-0.5">
                        {activity.type === "Match Found" ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const dashboardStats = [
  {
    label: "Active Reports",
    value: "3",
    icon: AlertTriangle,
    color: "orange-500"
  },
  {
    label: "Potential Matches",
    value: "12",
    icon: Search,
    color: "blue-500"
  },
  {
    label: "Cases Resolved",
    value: "8",
    icon: CheckCircle,
    color: "green-500"
  },
  {
    label: "Pending Updates",
    value: "4",
    icon: Clock,
    color: "yellow-500"
  }
];