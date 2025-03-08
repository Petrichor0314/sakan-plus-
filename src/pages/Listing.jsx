// File: src/pages/Listing.jsx
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  MapPin,
  Copy,
  BedDouble,
  Bath,
  Car,
  Sofa,
  Share2,
  Heart,
  Ruler,
  Calendar,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "@/styles/swiper-custom.css"; // Your custom arrow/bullet styling

// Contact component (exported as default from ../components/Contact)
import Contact from "../components/Contact";

// Add the custom marker icon configuration from Listings page
const customIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div class="w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center animate-[ripple_1.5s_infinite] shadow-lg">
          <div class="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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
    <main className="bg-white">
      {/* Title Section */}
      <div className="container mx-auto px-32 py-12">
        {/* Title and Price */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[32px] font-bold text-gray-900">
            {listing.name}
          </h1>
          <div className="flex items-baseline">
            <span className="text-[32px] font-bold text-gray-900">
              ${formattedPrice}
            </span>
            {listing.type === "rent" && (
              <span className="text-gray-600 text-base ml-1">/month</span>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

        {/* Features and Location Headers */}
        <div className="flex gap-32">
          <div>
            <h2 className="text-sm font-medium text-gray-600 mb-3">Features</h2>
            <div className="flex items-center gap-8 text-gray-700">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-gray-400" />
                <span>Beds: {listing.bedrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-gray-400" />
                <span>Baths: {listing.bathrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-gray-400" />
                <span>Sqft: {listing.size}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-600 mb-3">Location</h2>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{listing.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Swiper Section */}
      <div className="w-full container mx-auto px-4 mt-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView="auto"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="h-[500px]"
          breakpoints={{
            640: {
              slidesPerView:
                listing.imgUrls.length < 3 ? listing.imgUrls.length : 3,
            },
          }}
        >
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide
              key={index}
              className={`
                ${
                  listing.imgUrls.length === 1
                    ? "w-full"
                    : listing.imgUrls.length === 2
                    ? "w-1/2"
                    : "w-1/3"
                }
              `}
            >
              <div className="h-full w-full relative group">
                <img
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container mx-auto px-32 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Description and Overview (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Overview</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <BedDouble className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">{listing.bedrooms} Rooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Bath className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">{listing.bathrooms} Rooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Ruler className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="font-semibold">{listing.size} m²</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parking</p>
                    <p className="font-semibold">
                      {listing.parking ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Sofa className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Furnished</p>
                    <p className="font-semibold">
                      {listing.furnished ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{listing.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities And Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">
                Amenities And Features
              </h2>
              <div className="grid grid-cols-3 gap-y-4">
                {Object.entries(listing.amenities)
                  .filter(([_, value]) => value)
                  .map(([amenity]) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Map Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Map Location</h2>
              <div className="rounded-xl overflow-hidden h-[400px]">
                <MapContainer
                  center={[listing.geolocation.lat, listing.geolocation.lng]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution="Google Maps"
                    url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                  />
                  <MarkerClusterGroup>
                    <Marker
                      position={[
                        listing.geolocation.lat,
                        listing.geolocation.lng,
                      ]}
                      icon={customIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-semibold">{listing.name}</h3>
                          <p className="text-sm text-gray-600">
                            {listing.address}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </MarkerClusterGroup>
                </MapContainer>
              </div>
              <button
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${listing.geolocation.lat},${listing.geolocation.lng}`,
                    "_blank"
                  )
                }
              >
                View larger map
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar - Contact Form (1/3) */}
          <div className="space-y-8">
            {listing.userRef !== auth.currentUser?.uid && (
              <Contact userRef={listing.userRef} listing={listing} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
