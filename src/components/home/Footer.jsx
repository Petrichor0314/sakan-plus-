import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function HomeFooter() {
  const footerRef = useRef(null);
  const footerInView = useInView(footerRef, { once: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      ref={footerRef}
      initial="hidden"
      animate={footerInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="bg-gray-900 text-white py-16"
    >
      <div className="container mx-auto max-w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              We are dedicated to helping you find your perfect property. With
              years of experience and a commitment to excellence, we make your
              real estate journey seamless.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/listings"
                  className="text-gray-400 hover:text-white transition"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="text-gray-400 hover:text-white transition"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-500" />
                <span className="text-gray-400">+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-500" />
                <span className="text-gray-400">contact@realestate.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                <span className="text-gray-400">123 Real Estate St, City</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Real Estate. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
