import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,
  MapPin,
  EnvelopeSimple,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-footerBg text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        {/* Logo & Description */}
        <div>
          <h2 className="text-3xl font-bold">Guestify</h2>
          <p className="mt-2 text-gray-200">
            Promoting the best paying guest accommodations in West Bengal.
          </p>
          <br />
          <address>
            Guestify Headquarters 123<br/>
            Lake View Road, Salt Lake City, Sector V,
            Kolkata, West Bengal, 700091, India.
          </address>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="/" className="underline-offset-2 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="underline-offset-2 hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="underline-offset-2 hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/login" className="underline-offset-2 hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="underline-offset-2 hover:underline">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={20} /> West Bengal, India
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeSimple size={20} /> info@guestify.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={20} /> +91 98765 43210
            </li>
          </ul>
        </div>
      </div>

      <hr/>
      {/* Social Media */}
      <div className="mt-4 flex justify-center gap-6">
        <Link href="#" className="hover:text-buttons" data-tooltip="Facebook" data-tooltip-pos="top">
          <FacebookLogo size={28} />
        </Link>
        <Link href="#" className="hover:text-buttons" data-tooltip="Instagram" data-tooltip-pos="top">
          <InstagramLogo size={28} />
        </Link>
        <Link href="#" className="hover:text-buttons" data-tooltip="Twitter" data-tooltip-pos="top">
          <TwitterLogo size={28} />
        </Link>
        <Link href="#" className="hover:text-buttons" data-tooltip="Linked In" data-tooltip-pos="top">
          <LinkedinLogo size={28} />
        </Link>
      </div>


      {/* Copyright */}
      <div className="py-3 text-center text-sm text-gray-200">
        &copy; {new Date().getFullYear()} Guestify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
