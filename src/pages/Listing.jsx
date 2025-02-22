// File: src/pages/Listing.jsx
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { MapPin, Copy, BedDouble, Bath, Car, Sofa } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "@/styles/swiper-custom.css"; // Your custom arrow/bullet styling

// Contact component (exported as default from ../components/Contact)
import Contact from "../components/Contact";

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
        console.log(docSnap.data());
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2000);
  };

  // Format the price with commas
  const formattedPrice = listing.offer
    ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* For Sale/Rent Badge */}
          <div className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1">
            <span className="text-sm font-medium text-white">
              {listing.type === "rent" ? "For rent" : "For sale"}
            </span>
          </div>

          {/* Property Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900">
            {listing.name}
          </h1>

          {/* Property Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-600">
            <div className="flex items-center gap-1">
              <BedDouble className="w-5 h-5" />
              <span>
                {listing.bedrooms
                  ? `${listing.bedrooms} Bedroom${
                      listing.bedrooms > 1 ? "s" : ""
                    }`
                  : "1 Bedroom"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-5 h-5" />
              <span>
                {listing.bathrooms
                  ? `${listing.bathrooms} Bathroom${
                      listing.bathrooms > 1 ? "s" : ""
                    }`
                  : "1 Bathroom"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="w-5 h-5" />
              <span>{listing.parking ? "Parking" : "No Parking"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sofa className="w-5 h-5" />
              <span>{listing.furnished ? "Furnished" : "Not Furnished"}</span>
            </div>
          </div>

          {/* Price  */}
          <div className="text-2xl sm:text-3xl font-bold">
            ${formattedPrice}
            {listing.type === "rent" && <span className="ml-1">/month</span>}
          </div>
        </div>
        {/* Swiper Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            className="aspect-[4/3] sm:aspect-[16/9]"
          >
            {listing.imgUrls.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={src}
                    alt={`Property image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Copy Link Button (absolute on top-right) */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleShare}
              className="flex items-center justify-center
                         w-10 h-10 bg-blue-600 rounded-full
                         hover:bg-blue-700 transition-all
                         focus:outline-none"
            >
              <Copy className="w-5 h-5 text-white" />
            </button>
            {shareLinkCopied && (
              <div className="absolute top-12 right-0 bg-white px-3 py-1 rounded shadow-lg">
                Link copied!
              </div>
            )}
          </div>
        </div>
        {/* Property Description (Static Placeholder) */}
        <div className="px-6 sm:px-10 mt-6 sm:mt-8">
          <p className="text-lg sm:text-xl text-gray-600">
            {listing.description}
          </p>
        </div>
        {/* Location & Map */}
        <div className="space-y-3 sm:space-y-4">
          {/* Address */}
          <div className="flex items-center gap-2 text-gray-600 text-base font-medium sm:text-lg mt-4 sm:mt-6">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span>{listing.address}</span>
          </div>

          {/* Map Container (no border) */}
          <div className="aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-lg">
            <MapContainer
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", border: "none" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                  OpenStreetMap
                </a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>{listing.address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        {/* Property Details (Static Placeholder) */}
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
          <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">
            Property Details
          </h2>
          <div className="grid gap-3 sm:gap-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Size</span>
              <span>2,109 Sq.ft</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Built Year</span>
              <span>2020</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Bedrooms</span>
              <span>1</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Bathrooms</span>
              <span>1</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Parking Lots</span>
              <span>1</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Furnished</span>
              <span>Yes</span>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
          <Card className="bg-blue-600 p-4 sm:p-6 md:p-8">
            <CardContent className="space-y-4 sm:space-y-6 text-center text-white">
              <h3 className="text-base sm:text-lg font-medium">
                Contact Landlord Now
              </h3>
              <h2 className="text-2xl sm:text-3xl font-medium">
                Ready to make your step in real estate?
              </h2>
              <Button
                onClick={() => setContactLandlord(true)}
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
              >
                Contact Now
              </Button>
            </CardContent>
          </Card>
        )}
        {contactLandlord && listing.userRef !== auth.currentUser?.uid && (
          <Card className="bg-blue-600 p-4 sm:p-6 md:p-8">
            <CardContent>
              <Contact userRef={listing.userRef} listing={listing} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
