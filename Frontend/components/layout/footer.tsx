import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#00251a] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About ABSENS</h3>
            <p className="text-sm text-gray-300">
              A Government of India initiative for locating and reuniting missing persons using advanced AI technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>Toll Free: 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>help@absens.gov.in</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>

          {/* Official Seal */}
          <div className="space-y-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Government of India Seal" 
              className="h-16"
            />
            <p className="text-sm text-gray-300">
              Government of India
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center text-sm text-gray-300">
            <p>© {new Date().getFullYear()} ABSENS - Government of India. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              {" | "}
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              {" | "}
              <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const quickLinks = [
  { href: "/report", label: "Report Missing Person" },
  { href: "/search", label: "Search Database" },
  { href: "/alerts", label: "Alerts" },
  { href: "/volunteer", label: "Become a Volunteer" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
];