import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, House, Building2, Key } from "lucide-react";

export default function Services() {
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={servicesRef}
      initial="hidden"
      animate={servicesInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="bg-gray-50 py-16"
    >
      <div className="container mx-auto max-w-[90%]">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">
            OUR SERVICES
          </span>
          <h2 className="text-2xl font-bold mt-2">Welcome The HomeLengo</h2>
        </div>

        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Services cards with individual animations */}
          <motion.div
            variants={fadeInUp}
            className="bg-white p-8 rounded-3xl flex flex-col items-center text-center"
          >
            <House className="w-24 h-24 text-blue-600 mb-6 transition-colors duration-300 group-hover:text-blue-700" />
            <h3 className="text-xl font-semibold mb-4">Buy A New Home</h3>
            <p className="text-gray-600 mb-6">
              Discover your dream home effortlessly. Explore diverse properties
              and expert guidance for a seamless buying experience.
            </p>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-white p-8 rounded-3xl flex flex-col items-center text-center"
          >
            <Building2 className="w-24 h-24 text-blue-600 mb-6 transition-colors duration-300 group-hover:text-blue-700" />
            <h3 className="text-xl font-semibold mb-4">Sell A Home</h3>
            <p className="text-gray-600 mb-6">
              Sell confidently with expert guidance and effective strategies,
              showcasing your property's best features for a successful sale.
            </p>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-white p-8 rounded-3xl flex flex-col items-center text-center"
          >
            <Key className="w-24 h-24 text-blue-600 mb-6 transition-colors duration-300 group-hover:text-blue-700" />
            <h3 className="text-xl font-semibold mb-4">Rent A Home</h3>
            <p className="text-gray-600 mb-6">
              Discover your perfect rental effortlessly. Explore a diverse
              variety of listings tailored precisely to suit your unique
              lifestyle needs.
            </p>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
