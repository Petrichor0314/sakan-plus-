import * as React from "react";
import { MapPin, Search, Settings2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Range } from "react-range";
import CustomSelect from "./CustomSelect";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar({ variant = "default" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("type") || "rent"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const [selectedType, setSelectedType] = useState(
    searchParams.get("propertyType") || "All"
  );
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") || "Property Country"
  );
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice")) || 351,
    parseInt(searchParams.get("maxPrice")) || 700,
  ]);
  const [sizeRange, setSizeRange] = useState([
    parseInt(searchParams.get("minSize")) || 0,
    parseInt(searchParams.get("maxSize")) || 1000,
  ]);

  const [selectedLabels, setSelectedLabels] = useState(
    searchParams.get("labels") || "Property Labels"
  );
  const [isLabelsOpen, setIsLabelsOpen] = useState(false);

  const [selectedRooms, setSelectedRooms] = useState(
    searchParams.get("rooms") || "Rooms"
  );
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);

  const [selectedBaths, setSelectedBaths] = useState(
    searchParams.get("baths") || "Baths: Any"
  );
  const [isBathsOpen, setIsBathsOpen] = useState(false);

  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get("amenities")
      ? searchParams.get("amenities").split(",")
      : []
  );

  // Sample data arrays
  const types = ["All", "House", "Apartment", "Condo"];
  const countries = ["Property Country", "USA", "Canada", "UK"];
  const labels = ["Property Labels", "Luxury", "Modern", "Classic"];
  const rooms = ["Rooms", "1", "2", "3", "4+"];
  const baths = ["Baths: Any", "1", "2", "3", "4+"];

  // Ref for the advanced panel
  const advancedPanelRef = useRef(null);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        advancedPanelRef.current &&
        !advancedPanelRef.current.contains(event.target) &&
        !event.target.closest(".advanced-search-button")
      ) {
        event.preventDefault();
        setShowAdvanced(false);
        // Close all dropdowns
        setIsTypeOpen(false);
        setIsCountryOpen(false);
        setIsLabelsOpen(false);
        setIsRoomsOpen(false);
        setIsBathsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine if we're using the listings variant
  const isListings = variant === "listings";

  const handleSearch = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams({
      type: activeTab,
      keyword,
      location,
      propertyType: selectedType,
      country: selectedCountry,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minSize: sizeRange[0],
      maxSize: sizeRange[1],
      labels: selectedLabels,
      rooms: selectedRooms,
      baths: selectedBaths,
      amenities: selectedAmenities.join(","),
    });

    navigate(`/listings?${searchParams.toString()}`);
  };

  return (
    <div className="w-full min-h-screen sm:min-h-fit">
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          {/* Rent/Sale Toggle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10 w-full max-w-[300px] sm:max-w-none justify-center">
            <button
              onClick={() => setActiveTab("rent")}
              className={`rounded-full px-6 sm:px-12 py-3 text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                activeTab === "rent"
                  ? "bg-[#1D4ED8] text-white"
                  : "border border-white bg-transparent text-white hover:bg-white/10"
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => setActiveTab("sale")}
              className={`rounded-full px-6 sm:px-12 py-3 text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                activeTab === "sale"
                  ? "bg-[#1D4ED8] text-white"
                  : "border border-white bg-transparent text-white hover:bg-white/10"
              }`}
            >
              For Sale
            </button>
          </div>

          {/* Main Search Bar */}
          <div className="bg-white relative rounded-xl lg:rounded-[100px] shadow-lg p-4 lg:py-4 w-full max-w-[100%] mt-12 mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:pr-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 lg:pl-6 min-w-0">
                {/* Type Select */}
                <div className="w-full lg:w-[200px] relative shrink-0">
                  <label className="block text-[#A1A1AA] text-sm mb-0.5">
                    Type
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsTypeOpen(!isTypeOpen)}
                      className="w-full bg-white rounded-full py-2.5 px-4 text-sm text-left flex items-center justify-between cursor-pointer"
                    >
                      {selectedType}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className={`transition-transform duration-200 ${
                          isTypeOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M2.5 4.5L6 8L9.5 4.5"
                          stroke="#1F2937"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {isTypeOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-50">
                        {types.map((type) => (
                          <div
                            key={type}
                            onClick={() => {
                              setSelectedType(type);
                              setIsTypeOpen(false);
                            }}
                            className="px-4 py-2 text-sm cursor-pointer text-gray-900 hover:text-[#1D4ED8]"
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200" />
                </div>

                {/* Location Input */}
                <div className="w-full lg:w-[240px] relative shrink-0">
                  <label className="block text-[#A1A1AA] text-sm mb-0.5">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full lg:rounded-none border border-gray-100 lg:border-none px-4 lg:pl-0"
                    />
                    <button className="absolute right-4 lg:right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-900 flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200" />
                </div>

                {/* Keyword Input */}
                <div className="w-full lg:w-[240px] relative shrink-0">
                  <label className="block text-[#A1A1AA] text-sm mb-0.5">
                    Keyword
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Keyword."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full lg:rounded-none border border-gray-100 lg:border-none px-4 lg:pl-0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0 shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdvanced(!showAdvanced);
                  }}
                  className="advanced-search-button flex-1 lg:w-[220px] whitespace-nowrap inline-flex items-center justify-center gap-3 rounded-full border border-[#1D4ED8] bg-white px-4 sm:px-10 h-12 text-sm font-medium text-gray-900 hover:bg-[#1D4ED8] hover:text-white transition-colors duration-200"
                >
                  <Settings2
                    size={24}
                    className="!h-6 !w-6 min-w-[24px] min-h-[24px]"
                  />
                  {!isMobile && "Search advanced"}
                </button>
                <button
                  className="flex-1 lg:w-[160px] inline-flex items-center justify-center gap-3 rounded-full bg-[#1D4ED8] px-4 sm:px-10 h-12 text-sm font-medium text-white hover:bg-[#1D4ED8]/90"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5" />
                  {!isMobile && "Search"}
                </button>
              </div>
            </div>
          </div>
          {/* Advanced Search Panel */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                ref={advancedPanelRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 right-0 top-full mt-4 bg-white rounded-[32px] shadow-lg p-4 sm:p-6 z-50 mx-4 sm:mx-0"
              >
                <div className="space-y-6">
                  {/* Price and Size Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="text-gray-900 text-sm block mb-3">
                        Price: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Range
                        step={1}
                        min={100}
                        max={5000000}
                        values={priceRange}
                        onChange={(values) => setPriceRange(values)}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="h-1 w-full bg-gray-200 rounded-full"
                          >
                            <div
                              className="h-full bg-[#1D4ED8] rounded-full"
                              style={{
                                width: `${
                                  ((priceRange[1] - priceRange[0]) /
                                    (5000000 - 100)) *
                                  100
                                }%`,
                                left: `${
                                  ((priceRange[0] - 100) / (5000000 - 100)) *
                                  100
                                }%`,
                                position: "absolute",
                              }}
                            />
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            className="h-4 w-4 bg-white border-2 border-[#1D4ED8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-gray-900 text-sm block mb-3">
                        Size: {sizeRange[0]} - {sizeRange[1]}
                      </label>
                      <Range
                        step={1}
                        min={0}
                        max={1000}
                        values={sizeRange}
                        onChange={(values) => setSizeRange(values)}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="h-1 w-full bg-gray-200 rounded-full"
                          >
                            <div
                              className="h-full bg-[#1D4ED8] rounded-full"
                              style={{
                                width: `${
                                  ((sizeRange[1] - sizeRange[0]) / 1000) * 100
                                }%`,
                                left: `${(sizeRange[0] / 1000) * 100}%`,
                                position: "absolute",
                              }}
                            />
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            className="h-4 w-4 bg-white border-2 border-[#1D4ED8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CustomSelect
                      label="Property Country"
                      value={selectedCountry}
                      options={countries}
                      onChange={setSelectedCountry}
                      isOpen={isCountryOpen}
                      setIsOpen={setIsCountryOpen}
                    />

                    <CustomSelect
                      label="Property Labels"
                      value={selectedLabels}
                      options={labels}
                      onChange={setSelectedLabels}
                      isOpen={isLabelsOpen}
                      setIsOpen={setIsLabelsOpen}
                    />

                    <CustomSelect
                      label="Rooms"
                      value={selectedRooms}
                      options={rooms}
                      onChange={setSelectedRooms}
                      isOpen={isRoomsOpen}
                      setIsOpen={setIsRoomsOpen}
                    />

                    <CustomSelect
                      label="Bathrooms"
                      value={selectedBaths}
                      options={baths}
                      onChange={setSelectedBaths}
                      isOpen={isBathsOpen}
                      setIsOpen={setIsBathsOpen}
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-gray-900 text-sm font-medium mb-3">
                      Amentities:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3">
                      {[
                        "Bed Linens",
                        "Carbon Alarm",
                        "Check-in Lockbox",
                        "Coffee Maker",
                        "Dishwasher",
                        "Extra Pillows",
                        "First Aid Kit",
                        "Hangers",
                        "Iron",
                        "Microwave",
                        "Refrigerator",
                        "Security Cameras",
                        "Smoke alarm",
                        "TV Standard Cable",
                      ].map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAmenities([
                                  ...selectedAmenities,
                                  amenity,
                                ]);
                              } else {
                                setSelectedAmenities(
                                  selectedAmenities.filter((a) => a !== amenity)
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-[#1D4ED8] focus:ring-0 focus:ring-offset-0"
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
