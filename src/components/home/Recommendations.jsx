import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import ListingItem from "../ListingItem";

export default function Recommendations() {
  const recommendationsRef = useRef(null);
  const recommendationsInView = useInView(recommendationsRef, { once: true });
  const [activeCategory, setActiveCategory] = useState("all");

  // State for all listing types
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  const [houseListings, setHouseListings] = useState(null);
  const [apartmentListings, setApartmentListings] = useState(null);
  const [condoListings, setCondoListings] = useState(null);

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
      } catch (error) {
        console.log("Error fetching condo listings:", error);
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

  return (
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
  );
}
