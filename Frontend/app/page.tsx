import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Users, Bell, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section with Government Seal */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-[#004d40]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d40] to-[#00695c]"></div>
        <div className="container relative">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India Seal"
                className="h-24 md:h-32"
                width={128}
                height={128}
              />
            </div>
            <div className="space-y-4 text-white">
              <div className="text-sm md:text-base tracking-wider">Government of India</div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                ABSENS
              </h1>
              <p className="text-lg md:text-xl font-medium text-teal-50">
                AI-Based System for Efficiently Notifying and Searching
              </p>
              <p className="max-w-[42rem] mx-auto text-teal-100 text-sm md:text-base">
                A Government Initiative to Locate Missing Individuals Using Advanced Technology
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="min-w-[200px]" asChild>
                <Link href="/report">
                  Report Missing Person
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent text-white hover:bg-white/10" asChild>
                <Link href="/search">
                  Search Database
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-teal-50">
                <div className="text-2xl md:text-3xl font-bold text-teal-900">{stat.value}</div>
                <div className="text-sm text-teal-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              How ABSENS Works
            </h2>
            <p className="mt-4 text-gray-600">
              Advanced Technology for Missing Person Identification
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#004d40] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Join Our Mission to Protect and Reunite
            </h2>
            <p className="text-teal-100 mb-8">
              Be part of our nationwide network of volunteers and law enforcement agencies.
              Help us create a safer community for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link href="/register">
                  Register as Volunteer
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white hover:bg-white/10">
                <Link href="/dashboard">
                  Access Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const stats = [
  { value: "50,000+", label: "Missing Persons Found" },
  { value: "24/7", label: "Support Available" },
  { value: "100+", label: "Connected Agencies" },
  { value: "1000+", label: "Active Volunteers" }
];

const features = [
  {
    title: "AI Recognition",
    description: "State-of-the-art facial recognition and age progression technology for accurate identification",
    icon: Search
  },
  {
    title: "Real-time Alerts",
    description: "Instant notifications for potential matches and sightings across the country",
    icon: Bell
  },
  {
    title: "Volunteer Network",
    description: "Nationwide network of verified volunteers and organizations working together",
    icon: Users
  },
  {
    title: "Law Enforcement",
    description: "Secure integration with police and law enforcement agencies across India",
    icon: Shield
  }
];