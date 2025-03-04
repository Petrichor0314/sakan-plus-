import ListingItem from "@/components/ListingItem";
import SearchBar from "@/components/SearchBar";
import CustomSelect from "@/components/CustomSelect";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { Grid, List, ChevronDown } from "lucide-react";

function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const type = searchParams.get("type");
  const keyword = searchParams.get("keyword");
  const location = searchParams.get("location");
  const propertyType = searchParams.get("propertyType");
  const country = searchParams.get("country");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minSize = searchParams.get("minSize");
  const maxSize = searchParams.get("maxSize");
  const labels = searchParams.get("labels");
  const rooms = searchParams.get("rooms");
  const baths = searchParams.get("baths");
  const amenities = searchParams.get("amenities")?.split(",") || [];
  console.log(
    type,
    keyword,
    location,
    propertyType,
    country,
    minPrice,
    maxPrice,
    minSize,
    maxSize,
    labels,
    rooms,
    baths,
    amenities
  );

  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("offer", "==", false),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        // execute the query
        const querySnap = await getDocs(q);

        const listingsData = [];
        querySnap.forEach((doc) => {
          listingsData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listingsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  const sortOptions = [
    "Sort by (Default)",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4 ">
        <div className="container mx-auto px-4">
          <SearchBar variant="listings" />
        </div>
      </div>
      <div className="container mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-6 bg-black min-h-screen text-white">
          This is where the map is supposed to be
        </div>
        <div className="col-span-1 lg:col-span-6">
          <div className="flex flex-col">
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
                  onChange={setSortBy}
                  isOpen={isSortOpen}
                  setIsOpen={setIsSortOpen}
                  className="w-full"
                />
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
              {listings &&
                listings.length > 0 &&
                listings.map((listing) => (
                  <li key={listing.id} className="w-full flex justify-center">
                    <ListingItem listing={listing.data} id={listing.id} />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listings;
