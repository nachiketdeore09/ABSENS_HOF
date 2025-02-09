import { Bell, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      type: "Missing Person",
      name: "Rahul Kumar",
      age: 10,
      location: "Sangam Area, Prayagraj",
      date: "2024-03-17T14:30:00",
      description:
        "Last seen wearing blue shirt and black pants near the Sangam area.",
      image:
        "https://images.unsplash.com/photo-1555009393-a50dadde3b64?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      type: "Potential Match",
      name: "Unknown",
      location: "Sector 2, Prayagraj",
      date: "2024-03-17T15:45:00",
      description: "Possible match for case #MP2024-156. Confidence score: 85%",
      image:
        "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=150&h=150&fit=crop",
    },
  ];

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recent Alerts</h1>
            <p className="text-muted-foreground mt-2">
              Stay updated with the latest alerts and potential matches
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Subscribe to Alerts
          </Button>
        </div>

        <div className="grid gap-6">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  {alert.type}
                </CardTitle>
                <CardDescription>
                  {new Date(alert.date).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={alert.image}
                    alt={alert.name}
                    className="rounded-lg object-cover"
                    width={96}
                    height={96}
                  />
                  <div className="space-y-2">
                    <h3 className="font-semibold">{alert.name}</h3>
                    {alert.age && (
                      <p className="text-sm text-muted-foreground">
                        Age: {alert.age}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {alert.location}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(alert.date).toLocaleString()}
                    </p>
                    <p className="text-sm">{alert.description}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">View Details</Button>
                      <Button size="sm" variant="outline">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
