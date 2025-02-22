"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

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

  function onChange(e) {
    setMessage(e.target.value);
  }

  return (
    landlord && (
      <div className="space-y-6 text-white">
        {/* Landlord Info */}
        <div className="text-center">
          <h3 className="text-xl font-semibold">Contact {landlord.name}</h3>
          <p className="text-white/90">
            about {listing.name?.toLowerCase() || "this property"}
          </p>
        </div>

        {/* Message Form */}
        <div className="space-y-4">
          <Textarea
            name="message"
            id="message"
            rows={4}
            value={message}
            onChange={onChange}
            placeholder="Write your message here..."
            className="bg-white text-gray-900 placeholder-gray-500"
          />
          <a
            href={`mailto:${landlord.email}?Subject=${encodeURIComponent(
              listing.name
            )}&body=${encodeURIComponent(message)}`}
            className="block"
          >
            <Button
              type="button"
              className="w-full bg-white text-blue-600 hover:bg-gray-100"
            >
              Send Message
            </Button>
          </a>
        </div>
      </div>
    )
  );
}
