import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";
import SearchBar from "@/components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [currentText, setCurrentText] = useState("Real Estate");

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
          limit(4)
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
          limit(4)
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
          limit(4)
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
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-black/40"
      style={{
        backgroundImage: "url('/modern-house.jpg')", // Make sure to add this image to your public folder
      }}
    >
      <div className="relative pt-32 pb-20">
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
      {/* Test div to reserve space */}
      <div className="w-full h-[500px] bg-white">
        {/* This is just to test the layout */}
      </div>
    </div>
  );
}
