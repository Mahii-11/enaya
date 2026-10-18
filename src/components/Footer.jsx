import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: "/shop-page" },
  { label: "Online Sale", to: "/online-sale" },
  { label: "My Cart", to: "/cart" },
  { label: "Order History", to: "/dashboard" },
];

const CARE_LINKS = [
  { label: "Contact Us", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Returns & Exchanges", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const SOCIALS = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

const linkClass = "inline-block py-1 hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-12">
        {/*
          Mobile:  brand (full) | Quick Links + Customer Care pasha-pashi | contact (full)
          Tablet:  brand + contact upore, dui link list niche
          Desktop: 4 column (12-col grid)
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xl">
                G
              </div>
              <span className="text-xl font-bold font-display text-white tracking-tight">
                GadgetGlobe
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your one-stop destination for premium electronics and gadgets.
              Quality guaranteed, fast delivery.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2 md:order-3 lg:order-none">
            <h4 className="text-white font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-span-1 lg:col-span-2 md:order-4 lg:order-none">
            <h4 className="text-white font-semibold mb-3 sm:mb-4">Customer Care</h4>
            <ul className="space-y-1.5 text-sm">
              {CARE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-4 md:order-2 lg:order-none">
            <h4 className="text-white font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <span>
                  123 Tech Avenue, Silicon Valley
                  <br />
                  CA 94000, USA
                </span>
              </li>
              <li>
                <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 text-white shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@gadgetglobe.com" className="flex items-center gap-3 hover:text-white transition-colors min-w-0">
                  <Mail className="h-5 w-5 text-white shrink-0" />
                  <span className="break-all">support@gadgetglobe.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} GadgetGlobe. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
