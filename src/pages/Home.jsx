import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";
import SearchBar from "@/components/SearchBar";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  MessageSquareQuote,
  House,
  Building2,
  Key,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState("Real Estate");
  const [activeCategory, setActiveCategory] = useState("all");

  // Refs for scroll animations
  const servicesRef = useRef(null);
  const recommendationsRef = useRef(null);
  const locationsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const footerRef = useRef(null);

  // Check if sections are in view
  const servicesInView = useInView(servicesRef, { once: true });
  const recommendationsInView = useInView(recommendationsRef, { once: true });
  const locationsInView = useInView(locationsRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });
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

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) =>
        prev === "Real Estate" ? "Dream Home" : "Real Estate"
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // State for all listing types
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  const [houseListings, setHouseListings] = useState(null);
  const [apartmentListings, setApartmentListings] = useState(null);
  const [condoListings, setCondoListings] = useState(null);

  // Fetch offers
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetch rent listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetch sale listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetch house listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("propertyType", "==", "house"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setHouseListings(listings);
        console.log("House listings fetched:", listings);
      } catch (error) {
        console.log("Error fetching house listings:", error);
      }
    }
    fetchListings();
  }, []);

  // Fetch apartment listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("propertyType", "==", "Apartment"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setApartmentListings(listings);
        console.log("Apartment listings fetched:", listings);
      } catch (error) {
        console.log("Error fetching apartment listings:", error);
      }
    }
    fetchListings();
  }, []);

  // Fetch condo listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("propertyType", "==", "condo"),
          limit(6)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setCondoListings(listings);
        console.log("Condo listings fetched:", listings);
      } catch (error) {
        console.log("Error fetching condo listings:", error);
      }
    }
    fetchListings();
  }, []);

  console.log("offerListings", offerListings);
  console.log("rentListings", rentListings);
  console.log("saleListings", saleListings);
  console.log("houseListings", houseListings);
  console.log("apartmentListings", apartmentListings);
  console.log("condoListings", condoListings);

  // Function to get the listings based on active category
  const getListingsToDisplay = () => {
    switch (activeCategory) {
      case "rent":
        return rentListings;
      case "sale":
        return saleListings;
      case "houses":
        return houseListings;
      case "apartments":
        return apartmentListings;
      case "condos":
        return condoListings;
      case "offers":
        return offerListings;
      default:
        const allListings = [
          ...(offerListings || []),
          ...(rentListings || []),
          ...(saleListings || []),
          ...(houseListings || []),
          ...(apartmentListings || []),
          ...(condoListings || []),
        ];
        return Array.from(
          new Map(allListings.map((item) => [item.id, item])).values()
        );
    }
  };

  const locations = [
    {
      name: "Casablanca",
      region: "Casablanca-Settat",
      city: "Casablanca",
      properties: 15,
      image: "/locations/casablanca.jpg",
    },
    {
      name: "Rabat",
      region: "Rabat-Salé-Kénitra",
      city: "Rabat",
      properties: 12,
      image: "/locations/rabat.jpg",
    },
    {
      name: "Marrakech",
      region: "Marrakech-Safi",
      city: "Marrakech",
      properties: 18,
      image: "/locations/marrakech.jpg",
    },
    {
      name: "Tangier",
      region: "Tanger-Tétouan-Al Hoceïma",
      city: "Tangier",
      properties: 10,
      image: "/locations/tangier.jpg",
    },
    {
      name: "Agadir",
      region: "Souss-Massa",
      city: "Agadir",
      properties: 8,
      image: "/locations/agadir.jpg",
    },
    {
      name: "Fez",
      region: "Fès-Meknès",
      city: "Fez",
      properties: 9,
      image: "/locations/fez.jpg",
    },
  ];

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

  const handleLocationClick = (location) => {
    const params = new URLSearchParams();
    params.append("region", location.region);
    if (location.city) {
      params.append("city", location.city);
    }
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-black/40 -z-10 h-screen"
        style={{
          backgroundImage: "url('/modern-house.jpg')",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="relative pt-32 pb-48">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-2">
              <span>Find Your</span>
              <div className="h-[60px] sm:h-[72px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentText}
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: -50 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeInOut",
                    }}
                  >
                    {currentText}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-12">
            We are a real estate agency that will help you find the best
            residence you dream of, let's discuss for your dream house?
          </p>

          <div className="text-left">
            <SearchBar variant="home" />
          </div>
        </div>
      </div>

      {/* Our Services Section */}
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
                Discover your dream home effortlessly. Explore diverse
                properties and expert guidance for a seamless buying experience.
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

      {/* Recommendations */}
      <motion.div
        ref={recommendationsRef}
        initial="hidden"
        animate={recommendationsInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="bg-white py-16"
      >
        <div className="container mx-auto max-w-[90%]">
          <h2 className="text-3xl font-bold text-center mb-6">
            Recommended For You
          </h2>

          {/* Category Filter Tabs */}
          <motion.div
            variants={staggerChildren}
            className="flex justify-center gap-4 mb-8 flex-wrap"
          >
            {/* Filter buttons */}
            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("all")}
            >
              All
            </motion.button>

            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "offers"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("offers")}
            >
              Offers
            </motion.button>

            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "houses"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("houses")}
            >
              Houses
            </motion.button>

            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "apartments"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("apartments")}
            >
              Apartments
            </motion.button>

            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "condos"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("condos")}
            >
              Condos
            </motion.button>

            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "rent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("rent")}
            >
              For Rent
            </motion.button>

            <motion.button
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full ${
                activeCategory === "sale"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black hover:bg-blue-600 hover:text-white"
              } transition`}
              onClick={() => setActiveCategory("sale")}
            >
              For Sale
            </motion.button>
          </motion.div>

          {/* Listings Grid */}
          <motion.div variants={staggerChildren} className="w-full">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getListingsToDisplay() &&
                getListingsToDisplay().length > 0 &&
                getListingsToDisplay().map((listing) => (
                  <motion.li
                    key={listing.id}
                    variants={fadeInUp}
                    className="flex justify-center"
                  >
                    <ListingItem listing={listing.data} id={listing.id} />
                  </motion.li>
                ))}
            </ul>
          </motion.div>

          {/* View All Button */}
          <motion.div variants={fadeInUp} className="text-center mt-10">
            <Link
              to={`/listings${
                activeCategory !== "all" && activeCategory !== "offers"
                  ? `?propertyType=${activeCategory}`
                  : ""
              }`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:shadow-lg"
            >
              View All Listings
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Locations Section */}
      <motion.section
        ref={locationsRef}
        initial="hidden"
        animate={locationsInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="py-16 bg-white overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">
              EXPLORE CITIES
            </span>
            <h2 className="text-2xl font-bold mt-2">Our Location For You</h2>
          </div>

          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletActiveClass: "swiper-pagination-bullet-active",
              bulletClass: "swiper-pagination-bullet",
              renderBullet: function (index, className) {
                return (
                  '<span class="' +
                  className +
                  " bg-gray-300 hover:bg-blue-600 w-3 h-3 rounded-full inline-block mx-1 cursor-pointer transition-colors duration-300 " +
                  (className.includes("active") ? "!bg-blue-600" : "") +
                  '"></span>'
                );
              },
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
            className="pb-16"
          >
            {locations.map((location) => (
              <SwiperSlide key={location.name}>
                <div
                  className="relative h-[360px] rounded-3xl overflow-hidden cursor-pointer"
                  onClick={() => handleLocationClick(location)}
                >
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute left-4 right-4 bottom-4 bg-white rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">
                          {location.properties} Properties
                        </p>
                        <h3 className="text-gray-900 font-semibold">
                          {location.name}
                        </h3>
                      </div>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-blue-600 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 text-gray-600 hover:text-white transition-colors duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination mt-12"></div>
          </Swiper>
        </div>
      </motion.section>

      {/* Testimonials Section */}
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
              market navigation, offering informed decisions and optimal
              results.
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

      {/* Footer */}
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
                  <span className="text-gray-400">
                    123 Real Estate St, City
                  </span>
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
    </div>
  );
}
