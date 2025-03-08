"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { Button } from "./ui/button";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(listing.name || "");

  useEffect(() => {
    async function getLandlord() {
      if (!userRef) return;
      try {
        const docRef = doc(db, "users", userRef);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLandlord(docSnap.data());
        } else {
          toast.error("Could not get landlord data");
        }
      } catch (error) {
        toast.error("Error fetching landlord data");
      }
    }
    getLandlord();
  }, [userRef]);

  return (
    landlord && (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-2xl text-center font-semibold mb-6">
          Contact Seller
        </h2>

        {/* Email display */}
        <div className="flex justify-center items-center gap-2 text-gray-600 mb-6">
          <a href={`mailto:${landlord.email}`} className="hover:text-primary">
            {landlord.email}
          </a>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 px-3 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />

          <a
            href={`mailto:${landlord.email}?Subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(message)}`}
          >
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full 
                font-medium transition-colors duration-200"
            >
              Send Message
            </Button>
          </a>
        </div>
      </div>
    )
  );
}
