import Link from "next/link";
import { Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Support Info */}
          <div>
            <h4 className="text-sm font-bold uppercase mb-4 text-black">
              Support Info
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Hotline</p>
                  <p>0326118968</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p>hello@theneworiginals.co</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Hours</p>
                  <p>Mon - Sun 08:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-black uppercase mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/pages/about"
                  className="hover:text-black transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/contact"
                  className="hover:text-black transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/shipping"
                  className="hover:text-black transition"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/returns"
                  className="hover:text-black transition"
                >
                  Returns & Exchange
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase mb-4 text-black">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/pages/terms"
                  className="hover:text-black transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/privacy"
                  className="hover:text-black transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/warranty"
                  className="hover:text-black transition"
                >
                  Warranty Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase mb-4 text-black">
              Sign Up & Save
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to receive special offers, free giveaways, and other
              news.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <p className="text-center text-sm text-gray-600 mb-2">
            &copy; 2026 The New Originals. All rights reserved.
          </p>
          <div className="text-center">
            <button className="text-sm text-gray-600 hover:text-black transition">
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
