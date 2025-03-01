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
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";
import SearchBar from "@/components/SearchBar";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useDrag } from "@use-gesture/react";

export default function Home() {
  const [currentText, setCurrentText] = useState("Real Estate");
  // State to track which category is active (all, rent, sale)
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) =>
        prev === "Real Estate" ? "Dream Home" : "Real Estate"
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        // execute the query
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
  // Places for rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        // execute the query
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
  // Places for rent
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        // execute the query
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

  // Function to get the listings based on active category
  const getListingsToDisplay = () => {
    switch (activeCategory) {
      case "rent":
        return rentListings;
      case "sale":
        return saleListings;
      default:
        return offerListings;
    }
  };

  const containerRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const calculateTotalDots = () => {
      const containerWidth = window.innerWidth - 48;
      const cardWidth = 260;
      const cardsPerView = Math.floor(containerWidth / cardWidth);
      const totalCards = locations.length;
      return Math.ceil(totalCards / cardsPerView);
    };

    setTotalDots(calculateTotalDots());

    const handleResize = () => {
      setTotalDots(calculateTotalDots());
      // Reset position when window is resized
      setDragX(0);
      setActiveDot(0);
      controls.start({ x: 0 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controls]);

  const locations = [
    { name: "Texas", properties: 0, image: "/locations/texas.jpg" },
    { name: "Pembroke Pines", properties: 0, image: "/locations/pembroke.jpg" },
    { name: "New York", properties: 5, image: "/locations/newyork.jpg" },
    { name: "New Jersey", properties: 3, image: "/locations/newjersey.jpg" },
    { name: "Florida", properties: 1, image: "/locations/florida.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
    { name: "Chicago", properties: 2, image: "/locations/chicago.jpg" },
  ];

  const bind = useDrag(({ offset: [x], movement: [mx], dragging }) => {
    if (dragging) {
      setDragX(x);

      const containerWidth = window.innerWidth - 48;
      const cardWidth = 260;
      const cardsPerView = Math.floor(containerWidth / cardWidth);
      const maxScroll = -(260 * (locations.length - cardsPerView));
      const scrollProgress = Math.abs(x) / Math.abs(maxScroll);
      const dotIndex = Math.min(
        Math.floor(scrollProgress * totalDots),
        totalDots - 1
      );
      setActiveDot(dotIndex);
    }
  });

  const handleDotClick = async (dotIndex) => {
    const containerWidth = window.innerWidth - 48;
    const cardWidth = 260;
    const cardsPerView = Math.floor(containerWidth / cardWidth);
    const totalCards = locations.length;
    const maxScroll = -(cardWidth * (totalCards - cardsPerView));
    const scrollPerDot = maxScroll / (totalDots - 1);
    const newX = Math.max(maxScroll, Math.min(0, scrollPerDot * dotIndex));

    setDragX(newX);
    setActiveDot(dotIndex);
    await controls.start({
      x: newX,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
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
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white py-16 mt-32">
        <div className="container mx-auto max-w-[90%]">
          <h2 className="text-3xl font-bold text-center mb-6">
            Recommended For You
          </h2>

          {/* Category Filter Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {/* All/Featured Tab */}
            <button
              className={`px-5 py-2 rounded-full ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition`}
              onClick={() => setActiveCategory("all")}
            >
              Featured
            </button>

            {/* For Rent Tab */}
            <button
              className={`px-5 py-2 rounded-full ${
                activeCategory === "rent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition`}
              onClick={() => setActiveCategory("rent")}
            >
              For Rent
            </button>

            {/* For Sale Tab */}
            <button
              className={`px-5 py-2 rounded-full ${
                activeCategory === "sale"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition`}
              onClick={() => setActiveCategory("sale")}
            >
              For Sale
            </button>

            {/* You can add more category tabs here if needed */}
          </div>

          {/* Listings Grid */}
          <div className="w-full">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getListingsToDisplay() &&
                getListingsToDisplay().length > 0 &&
                getListingsToDisplay().map((listing) => (
                  <li key={listing.id} className="flex justify-center">
                    <ListingItem listing={listing.data} id={listing.id} />
                  </li>
                ))}
            </ul>
          </div>

          {/* View All Button - changes based on active category */}
          <div className="text-center mt-10">
            <Link
              to={
                activeCategory === "rent"
                  ? "/category/rent"
                  : activeCategory === "sale"
                  ? "/category/sale"
                  : "/offers"
              }
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:shadow-lg"
            >
              {activeCategory === "rent"
                ? "Explore More Rentals"
                : activeCategory === "sale"
                ? "Discover More Properties"
                : "View All Featured Listings"}
            </Link>
          </div>
        </div>
      </div>
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">
              EXPLORE CITIES
            </span>
            <h2 className="text-2xl font-bold mt-2">Our Location For You</h2>
          </div>

          <motion.div
            ref={containerRef}
            {...bind()}
            animate={controls}
            style={{ x: dragX }}
            drag="x"
            dragConstraints={{
              left: -(260 * locations.length - window.innerWidth + 48),
              right: 0,
            }}
            className="flex gap-4 cursor-pointer active:cursor-pointer touch-none"
          >
            {locations.map((location) => (
              <motion.div
                key={location.name}
                className="relative flex-shrink-0 w-[260px] group"
                whileTap={{ cursor: "pointer" }}
              >
                <div className="relative h-[360px] rounded-3xl overflow-hidden">
                  <img
                    draggable="false"
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />

                  {/* White info box */}
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
                      <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-blue-600 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalDots)].map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  activeDot === index ? "bg-blue-600" : "bg-gray-200"
                }`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
