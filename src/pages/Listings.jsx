import ListingItem from "@/components/ListingItem";
import SearchBar from "@/components/SearchBar";
import CustomSelect from "@/components/CustomSelect";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Bed, Bath, Move } from "lucide-react";
import { Link } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-cluster";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  and,
  startAt,
  endAt,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { Grid, List, ChevronDown } from "lucide-react";

// Custom marker icon configuration
const customIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div class="w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center animate-[ripple_1.5s_infinite] shadow-lg">
          <div class="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom cluster icon creator
const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<div class="bg-blue-500 rounded-full p-2 flex items-center justify-center text-white font-bold border-2 border-white">
            ${cluster.getChildCount()}
          </div>`,
    className: "custom-marker-cluster",
    iconSize: L.point(40, 40, true),
  });
};

function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const LISTINGS_PER_PAGE = 8;

  // Get all search parameters
  const type = searchParams.get("type") || "rent";
  const region = searchParams.get("region");
  const city = searchParams.get("city");
  const propertyType = searchParams.get("propertyType");
  const minPrice = parseInt(searchParams.get("minPrice")) || 0;
  const maxPrice = parseInt(searchParams.get("maxPrice")) || 30000;
  const minSize = parseInt(searchParams.get("minSize")) || 0;
  const maxSize = parseInt(searchParams.get("maxSize")) || 1000;
  const rooms = searchParams.get("rooms");
  const baths = searchParams.get("baths");
  const amenities = searchParams.get("amenities")?.split(",") || [];

  // Add sortBy to useEffect dependencies
  useEffect(() => {
    // Reset lastVisible when search params change
    setLastVisible(null);
    fetchListings();
  }, [searchParams, sortBy]); // Add sortBy as dependency

  async function fetchListings(loadMore = false) {
    try {
      if (loading) return; // Prevent multiple simultaneous fetches
      setLoading(true);
      const listingsRef = collection(db, "listings");

      console.log("Fetching listings with params:", {
        type,
        region,
        city,
        propertyType,
        minPrice,
        maxPrice,
        rooms,
        baths,
        amenities,
        loadMore,
        hasLastVisible: !!lastVisible,
      });

      // Build query based on whether we're loading more or not
      let q;
      if (loadMore && lastVisible) {
        console.log("Loading more listings after:", lastVisible.id);
        q = query(
          listingsRef,
          where("type", "==", type),
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(LISTINGS_PER_PAGE)
        );
      } else {
        console.log("Loading initial listings");
        q = query(
          listingsRef,
          where("type", "==", type),
          orderBy("timestamp", "desc"),
          limit(LISTINGS_PER_PAGE)
        );
      }

      console.log("Executing Firestore query...");
      const querySnap = await getDocs(q);
      console.log("Query returned:", querySnap.docs.length, "documents");

      // Update lastVisible only if we got results
      const lastVisibleDoc = querySnap.docs[querySnap.docs.length - 1];
      if (lastVisibleDoc) {
        setLastVisible(lastVisibleDoc);
      } else {
        setLastVisible(null); // No more results to load
      }

      const listingsData = querySnap.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      console.log("Mapped listings data:", listingsData.length, "items");

      // Log if no filters are applied
      const noFilters =
        !region &&
        !city &&
        !propertyType &&
        !rooms &&
        !baths &&
        (!amenities ||
          amenities.length === 0 ||
          (amenities.length === 1 && amenities[0] === ""));
      console.log("No filters applied:", noFilters);

      const filteredListings = listingsData.filter((listing) => {
        const data = listing.data;
        console.log("Processing listing:", listing.id, {
          listingType: data.type,
          listingRegion: data.region,
          listingCity: data.city,
          listingPropertyType: data.propertyType,
          listingPrice: data.offer ? data.discountedPrice : data.regularPrice,
          listingRooms: data.bedrooms,
          listingBaths: data.bathrooms,
          listingSize: data.size,
          listingAmenities: data.amenities,
        });

        // Skip filtering if no filters are applied
        if (noFilters) {
          console.log("Skipping filters for listing:", listing.id);
          return true;
        }

        // Region and City filtering
        if (region && region !== "All Regions") {
          if (data.region !== region) {
            console.log("Filtered out by region:", listing.id);
            return false;
          }
          if (city && data.city !== city) {
            console.log("Filtered out by city:", listing.id);
            return false;
          }
        }

        // Property Type filtering
        if (
          propertyType &&
          propertyType !== "All" &&
          data.propertyType !== propertyType.toLowerCase()
        ) {
          console.log("Filtered out by property type:", listing.id);
          return false;
        }

        // Price filtering
        const price = data.offer ? data.discountedPrice : data.regularPrice;
        if (price < minPrice || price > maxPrice) {
          console.log("Filtered out by price:", listing.id, price);
          return false;
        }

        // Rooms filtering
        if (rooms && rooms !== "Rooms" && data.bedrooms !== parseInt(rooms)) {
          console.log("Filtered out by rooms:", listing.id);
          return false;
        }

        // Bathrooms filtering
        if (
          baths &&
          baths !== "Baths: Any" &&
          data.bathrooms !== parseInt(baths)
        ) {
          console.log("Filtered out by baths:", listing.id);
          return false;
        }

        // Size filtering
        if (data.size < minSize || data.size > maxSize) {
          console.log("Filtered out by size:", listing.id);
          return false;
        }

        // Amenities filtering - only apply if amenities array is not empty and doesn't contain an empty string
        if (amenities && amenities.length > 0 && amenities[0] !== "") {
          console.log("Checking amenities for listing:", listing.id, {
            requestedAmenities: amenities,
            listingAmenities: data.amenities,
          });

          const hasAllAmenities = amenities.every(
            (amenity) => data.amenities && data.amenities[amenity]
          );

          if (!hasAllAmenities) {
            console.log("Filtered out by amenities:", listing.id);
            return false;
          }
        }

        console.log("Listing passed all filters:", listing.id);
        return true;
      });

      console.log(
        "After filtering:",
        filteredListings.length,
        "listings remain"
      );

      // Apply sorting
      const sortedListings = sortListings(filteredListings);
      console.log("After sorting:", sortedListings.length, "listings");

      // Update listings state based on whether we're loading more or not
      setListings((prev) =>
        loadMore ? [...prev, ...sortedListings] : sortedListings
      );

      // Hide "Load More" button if we got fewer results than the limit
      if (querySnap.docs.length < LISTINGS_PER_PAGE) {
        setLastVisible(null);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setLoading(false);
    }
  }

  // Helper function to sort listings
  function sortListings(listings) {
    return [...listings].sort((a, b) => {
      const priceA = parseInt(
        a.data.offer ? a.data.discountedPrice : a.data.regularPrice
      );
      const priceB = parseInt(
        b.data.offer ? b.data.discountedPrice : b.data.regularPrice
      );
      const timestampA = a.data.timestamp?.seconds || 0;
      const timestampB = b.data.timestamp?.seconds || 0;

      switch (sortBy) {
        case "Price: Low to High":
          return priceA - priceB;
        case "Price: High to Low":
          return priceB - priceA;
        case "Newest First":
          return timestampB - timestampA;
        default: // Sort by (Default) - newest first
          return timestampB - timestampA;
      }
    });
  }

  const sortOptions = [
    "Sort by (Default)",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <SearchBar variant="listings" />
        </div>
      </div>
      <div className="container mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-6">
          <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-end gap-4 mb-4">
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                <button
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <div className="w-[200px] mb-1">
                <CustomSelect
                  label=""
                  value={sortBy}
                  options={sortOptions}
                  onChange={(value) => {
                    setSortBy(value);
                    // Re-sort current listings without fetching
                    setListings((prevListings) => sortListings(prevListings));
                  }}
                  isOpen={isSortOpen}
                  setIsOpen={setIsSortOpen}
                  className="w-full"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-grow">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-900">
                    No listings found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                <>
                  <ul
                    className={`grid gap-4 w-full ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {listings.map((listing) => (
                      <li
                        key={listing.id}
                        className="w-full flex justify-center"
                      >
                        <ListingItem listing={listing.data} id={listing.id} />
                      </li>
                    ))}
                  </ul>

                  {lastVisible && (
                    <button
                      onClick={() => fetchListings(true)}
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Load More
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-6 h-[calc(100vh-120px)]">
          <MapContainer
            style={{
              height: "100%",
              width: "100%",
            }}
            center={[31.7917, -7.0926]} // Center of Morocco
            zoom={8}
          >
            <TileLayer
              attribution="Google Maps"
              url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            />
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}
            >
              {listings.map(
                (listing) =>
                  listing.data.geolocation && (
                    <Marker
                      key={listing.id}
                      position={[
                        listing.data.geolocation.lat,
                        listing.data.geolocation.lng,
                      ]}
                      icon={customIcon}
                    >
                      <Popup>
                        <Link
                          to={`/category/${listing.data.type}/${listing.id}`}
                        >
                          <div className="w-72 cursor-pointer hover:opacity-95 transition-opacity bg-white rounded-lg overflow-hidden">
                            <div className="flex">
                              {/* Image */}
                              <div className="w-1/3 relative">
                                <img
                                  src={listing.data.imgUrls[0]}
                                  alt={listing.data.name}
                                  className="h-full w-full object-cover"
                                  style={{ height: "100px" }}
                                />
                                {listing.data.offer && (
                                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    Featured
                                  </span>
                                )}
                              </div>

                              {/* Content */}
                              <div className="w-2/3 p-2">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                  {listing.data.name}
                                </h3>

                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3 text-gray-500" />
                                  <p className="text-xs text-gray-600 truncate">
                                    {listing.data.location}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Bed className="h-3 w-3" />
                                    {listing.data.bedrooms}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bath className="h-3 w-3" />
                                    {listing.data.bathrooms}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Move className="h-3 w-3" />
                                    {listing.data.size}m²
                                  </span>
                                </div>

                                <div className="mt-2 text-sm font-semibold text-blue-600">
                                  {listing.data.offer
                                    ? listing.data.discountedPrice.toLocaleString()
                                    : listing.data.regularPrice.toLocaleString()}{" "}
                                  MAD
                                  {listing.data.type === "rent" && " / month"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Popup>
                    </Marker>
                  )
              )}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Listings;
