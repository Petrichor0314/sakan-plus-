import * as React from "react";
import { MapPin, Search, Settings2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Range } from "react-range";
import CustomSelect from "./CustomSelect";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export default function SearchBar({ variant = "home" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("type") || "rent"
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [selectedRegion, setSelectedRegion] = useState(
    searchParams.get("region") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || ""
  );
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const [selectedPropertyType, setSelectedPropertyType] = useState(
    searchParams.get("propertyType") || "All"
  );
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);

  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice")) || 0,
    parseInt(searchParams.get("maxPrice")) || 30000,
  ]);
  const [sizeRange, setSizeRange] = useState([
    parseInt(searchParams.get("minSize")) || 0,
    parseInt(searchParams.get("maxSize")) || 1000,
  ]);

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

  // Moroccan regions
  const moroccanRegions = [
    "All Regions",
    "Tanger-Tétouan-Al Hoceïma",
    "L'Oriental",
    "Fès-Meknès",
    "Rabat-Salé-Kénitra",
    "Béni Mellal-Khénifra",
    "Casablanca-Settat",
    "Marrakech-Safi",
    "Drâa-Tafilalet",
    "Souss-Massa",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
  ];

  // Cities by region
  const citiesByRegion = {
    "All Regions": [],
    "Tanger-Tétouan-Al Hoceïma": [
      "Tanger",
      "Tétouan",
      "Al Hoceïma",
      "Chefchaouen",
      "Larache",
    ],
    "L'Oriental": ["Oujda", "Nador", "Berkane", "Taourirt", "Jerada"],
    "Fès-Meknès": ["Fès", "Meknès", "Taza", "Ifrane", "Sefrou"],
    "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Témara", "Skhirate"],
    "Béni Mellal-Khénifra": ["Béni Mellal", "Khouribga", "Khénifra", "Azilal"],
    "Casablanca-Settat": [
      "Casablanca",
      "Settat",
      "El Kelaa M'Gouna",
      "Mohammedia",
      "Kenitra",
    ],
    "Marrakech-Safi": [
      "Marrakech",
      "Safi",
      "Essaouira",
      "El Kelaa M'Gouna",
      "Ouarzazate",
    ],
    "Drâa-Tafilalet": [
      "Errachidia",
      "Ifrane",
      "Tafilalet",
      "Tinghir",
      "Zagora",
    ],
    "Souss-Massa": ["Agadir", "Taroudant", "Ouarzazate", "Essaouira", "Zagora"],
    "Guelmim-Oued Noun": [
      "Guelmim",
      "Oued Noun",
      "Dakhla",
      "Laayoune",
      "Boujdour",
    ],
    "Laâyoune-Sakia El Hamra": [
      "Laayoune",
      "Sakia El Hamra",
      "Dakhla",
      "Boujdour",
      "El Aaiún",
    ],
    "Dakhla-Oued Ed-Dahab": [
      "Dakhla",
      "Oued Ed-Dahab",
      "Laayoune",
      "El Aaiún",
      "Boujdour",
    ],
  };

  const propertyTypes = ["All", "House", "Apartment", "Condo"];
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
        setIsPropertyTypeOpen(false);
        setIsRegionOpen(false);
        setIsCityOpen(false);
        setIsRoomsOpen(false);
        setIsBathsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams({
      type: activeTab,
      location,
      region: selectedRegion,
      city: selectedCity,
      propertyType: selectedPropertyType,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minSize: sizeRange[0],
      maxSize: sizeRange[1],
      rooms: selectedRooms,
      baths: selectedBaths,
      amenities: selectedAmenities.join(","),
    });

    navigate(`/listings?${searchParams.toString()}`);
  };

  const isListings = variant === "listings";

  return (
    <div className="w-full px-4 md:px-0">
      {!isListings && (
        /* Type Toggle - Centered at top - Only show in home variant */
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab("rent")}
            className={`px-6 md:px-12 py-2 md:py-3 text-sm font-medium rounded-full transition-all duration-200 ease-in-out ${
              activeTab === "rent"
                ? "bg-[#1D4ED8] text-white"
                : "bg-transparent text-white border border-white"
            }`}
          >
            For Rent
          </button>
          <button
            onClick={() => setActiveTab("sale")}
            className={`px-6 md:px-12 py-2 md:py-3 text-sm font-medium rounded-full transition-all duration-200 ${
              activeTab === "sale"
                ? "bg-[#1D4ED8] text-white"
                : "bg-traparent text-white border border-white"
            }`}
          >
            For Sale
          </button>
        </div>
      )}

      {/* Main Search Bar */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4">
          {isListings && (
            /* Type Toggle - Show beside search bar in listings variant */
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("rent")}
                className={`px-8 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === "rent"
                    ? "bg-[#1D4ED8] text-white"
                    : "border border-[#1D4ED8] bg-white text-[#1D4ED8] hover:bg-gray-50"
                }`}
              >
                For Rent
              </button>
              <button
                onClick={() => setActiveTab("sale")}
                className={`px-8 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === "sale"
                    ? "bg-[#1D4ED8] text-white"
                    : "border border-[#1D4ED8] bg-white text-[#1D4ED8] hover:bg-gray-50"
                }`}
              >
                For Sale
              </button>
            </div>
          )}

          <div
            className={`flex-1 bg-white rounded-lg sm:rounded-2xl md:rounded-full shadow-md ${
              isListings ? "shadow-none" : ""
            } px-2 py-2`}
          >
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-4 md:px-6 py-2 md:rounded-xl">
              {/* Type Select */}
              <div className="w-full md:w-40 flex flex-col justify-center relative">
                <div className="text-xs text-gray-500">Type</div>
                <button
                  onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
                  className="w-full text-left text-sm py-1"
                >
                  {selectedPropertyType}
                  <ChevronDown className="float-right h-4 w-4" />
                </button>
                {isPropertyTypeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-50">
                    {propertyTypes.map((type) => (
                      <div
                        key={type}
                        onClick={() => {
                          setSelectedPropertyType(type);
                          setIsPropertyTypeOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Separator - Hidden on mobile */}
              <div className="hidden md:block h-10 w-px bg-gray-200"></div>

              {/* Region Select */}
              <div className="w-full md:w-40 flex flex-col justify-center relative">
                <div className="text-xs text-gray-500">Region</div>
                <button
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className={`w-full text-left text-sm py-1 flex items-center justify-between`}
                >
                  <span className="truncate">
                    {selectedRegion || "All Regions"}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </button>
                {isRegionOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-50">
                    {moroccanRegions.map((region) => (
                      <div
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          setSelectedCity("");
                          setIsRegionOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        {region}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Separator - Hidden on mobile */}
              <div className="hidden md:block h-10 w-px bg-gray-200"></div>

              {/* City Select */}
              <div className="w-full md:w-40 flex flex-col justify-center relative">
                <div className="text-xs text-gray-500">City</div>
                <button
                  onClick={() => setIsCityOpen(!isCityOpen)}
                  className={`w-full text-left text-sm py-1 flex items-center justify-between`}
                >
                  <span className="truncate">
                    {selectedCity || "Select City"}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </button>
                {isCityOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-50">
                    {(citiesByRegion[selectedRegion] || []).map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto md:ml-auto">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full md:w-auto px-6 md:px-10 py-2 md:py-3 text-sm font-medium rounded-full border border-[#1D4ED8] text-[#1D4ED8] hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  Advanced
                  <Settings2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-6 md:px-12 py-2 md:py-3 text-sm font-medium rounded-full bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]/90 flex items-center justify-center gap-2"
                >
                  Search
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            ref={advancedPanelRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mx-auto max-w-6xl px-4 z-50 mt-2"
          >
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="space-y-6">
                {/* Price and Size Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="text-gray-900 text-sm block mb-3">
                      Price: MAD {priceRange[0]} - MAD {priceRange[1]}
                    </label>
                    <Range
                      step={1000}
                      min={0}
                      max={30000}
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
                                  (10000000 - 0)) *
                                100
                              }%`,
                              left: `${(priceRange[0] / 30000) * 100}%`,
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
                      Size: {sizeRange[0]} - {sizeRange[1]} m²
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Amenities:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-3">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
