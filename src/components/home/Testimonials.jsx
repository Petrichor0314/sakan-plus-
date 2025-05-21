import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";

export default function Testimonials() {
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "/testimonials/sarah.jpg",
      text: "Found my dream home through this platform. The process was smooth and the team was incredibly helpful throughout.",
      rating: 5,
    },
    {
      name: "Mohammed Ali",
      role: "Property Investor",
      image: "/testimonials/mohammed.jpg",
      text: "Best real estate platform I've used. Great selection of properties and excellent customer service.",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      role: "First-time Buyer",
      image: "/testimonials/emma.jpg",
      text: "As a first-time buyer, I really appreciated how easy they made the whole process. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <motion.section
      ref={testimonialsRef}
      initial="hidden"
      animate={testimonialsInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="py-16 bg-gray-50"
    >
      <div className="container mx-auto max-w-[90%]">
        <div className="text-center mb-8">
          <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">
            OUR TESTIMONIALS
          </span>
          <h2 className="text-3xl font-bold mt-2">What's People Say's</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our seasoned team excels in real estate with years of successful
            market navigation, offering informed decisions and optimal results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl">
              {/* Quote Mark */}
              <div className="text-blue-600 text-6xl mb-4">
                <MessageSquareQuote />
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 mb-8">
                "My experience with property management services has exceeded
                expectations. They efficiently manage properties with a
                professional and attentive approach in every situation. I feel
                reassured that any issue will be resolved promptly and
                effectively."
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
