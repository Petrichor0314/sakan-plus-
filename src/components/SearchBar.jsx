import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Search,
  Settings2,
  ChevronDown,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Shadcn UI Components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable Sheet content

// Imports for Combobox
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Magic UI Components
import { ShineBorder } from "@/components/magicui/shine-border";
// import ShimmerButton from "@/components/magicui/shimmer-button"; // Using Shadcn Button for now, can be swapped
// import Particles from "@/components/magicui/particles"; // Optional for advanced section bg

export default function SearchBar({ variant = "home" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // --- STATE MANAGEMENT (largely preserved) ---
  const [activeTab, setActiveTab] = useState(
    searchParams.get("type") || "rent"
  );
  const [showAdvancedDesktop, setShowAdvancedDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Location state - current 'location' not directly mapped to an input, consider adding one or removing if not used
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [selectedRegion, setSelectedRegion] = useState(
    searchParams.get("region") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || ""
  );

  // State for Combobox open/close
  const [regionOpen, setRegionOpen] = React.useState(false);
  const [cityOpen, setCityOpen] = React.useState(false);

  const [selectedPropertyType, setSelectedPropertyType] = useState(
    searchParams.get("propertyType") || "All"
  );

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
  const [selectedBaths, setSelectedBaths] = useState(
    searchParams.get("baths") || "Baths: Any"
  );
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get("amenities")
      ? searchParams.get("amenities").split(",")
      : []
  );

  // Refs - primarily for click-outside, may be less needed with Shadcn components
  const advancedPanelRef = useRef(null); // For Collapsible, may not need custom click-outside

  // --- DATA (preserved) ---
  const moroccanRegions = [
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
  moroccanRegions.unshift("All Regions"); // Ensure "All Regions" is an option if selectedRegion can be empty
  const citiesByRegion = {
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
      "El Kelaa M'Gouna", // Note: El Kelaa M'Gouna is also listed under Marrakech-Safi in your data. You might want to verify/deduplicate.
      "Mohammedia",
      "Kenitra", // Note: Kenitra is also a city in Rabat-Salé-Kénitra. This might be intentional or a slight variation in data.
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
      "Ifrane", // Note: Ifrane is also listed under Fès-Meknès.
      "Tafilalet",
      "Tinghir",
      "Zagora",
    ],
    "Souss-Massa": ["Agadir", "Taroudant", "Ouarzazate", "Essaouira", "Zagora"], // Note: Ouarzazate, Essaouira, Zagora appear in multiple regions.
    "Guelmim-Oued Noun": [
      "Guelmim",
      "Oued Noun",
      "Dakhla", // Note: Dakhla, Laayoune, Boujdour appear in multiple southern regions.
      "Laayoune",
      "Boujdour",
    ],
    "Laâyoune-Sakia El Hamra": [
      "Laayoune",
      "Sakia El Hamra",
      "Dakhla",
      "Boujdour",
      "El Aaiún", // Note: El Aaiún is another name for Laayoune.
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
  const amenitiesList = [
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
  ];

  // --- EFFECTS (preserved, adjusted) ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const queryParams = new URLSearchParams({
      type: activeTab,
      ...(location && { location }),
      ...(selectedRegion &&
        selectedRegion !== "All Regions" && { region: selectedRegion }),
      ...(selectedCity && { city: selectedCity }),
      ...(selectedPropertyType &&
        selectedPropertyType !== "All" && {
          propertyType: selectedPropertyType,
        }),
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      minSize: sizeRange[0].toString(),
      maxSize: sizeRange[1].toString(),
      ...(selectedRooms &&
        selectedRooms !== "Rooms" && { rooms: selectedRooms }),
      ...(selectedBaths &&
        selectedBaths !== "Baths: Any" && { baths: selectedBaths }),
      ...(selectedAmenities.length > 0 && {
        amenities: selectedAmenities.join(","),
      }),
    });
    navigate(`/listings?${queryParams.toString()}`);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    // Potentially trigger a search or update other filters when tab changes
  };

  const isListings = variant === "listings";

  const AdvancedFiltersContent = () => (
    <div className="space-y-6">
      {" "}
      {/* Price and Size Range Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="priceRange"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price: MAD {priceRange[0]} - MAD {priceRange[1]}
          </Label>
          <DualRangeSlider
            id="priceRange"
            min={0}
            max={30000} // Adjust max as needed
            step={1000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-2"
          />
        </div>
        <div>
          <Label
            htmlFor="sizeRange"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Size: {sizeRange[0]}m² - {sizeRange[1]}m²
          </Label>
          <DualRangeSlider
            id="sizeRange"
            min={0}
            max={1000} // Adjust max as needed
            step={10}
            value={sizeRange}
            onValueChange={setSizeRange}
            className="mt-2"
          />
        </div>
      </div>
      <Separator />
      {/* Property Details Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="roomsSelect"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Rooms
          </Label>
          <Select value={selectedRooms} onValueChange={setSelectedRooms}>
            <SelectTrigger id="roomsSelect">
              <SelectValue placeholder="Select rooms" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="bathsSelect"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Bathrooms
          </Label>
          <Select value={selectedBaths} onValueChange={setSelectedBaths}>
            <SelectTrigger id="bathsSelect">
              <SelectValue placeholder="Select baths" />
            </SelectTrigger>
            <SelectContent>
              {baths.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      {/* Amenities Checkboxes */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity.toLowerCase().replace(/\s+/g, "-")}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  setSelectedAmenities((prev) =>
                    checked
                      ? [...prev, amenity]
                      : prev.filter((a) => a !== amenity)
                  );
                }}
              />
              <Label
                htmlFor={`amenity-${amenity
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="text-sm font-normal text-gray-600 dark:text-gray-400"
              >
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("w-full", variant === "home" ? "py-6" : "py-4")}>
      {/* Type Toggle */}
      <div
        className={cn(
          "mb-4",
          variant === "home" || isListings ? "flex justify-center" : "hidden",
          isListings && "md:hidden"
        )}
      >
        <Tabs
          defaultValue={activeTab}
          onValueChange={handleTabChange}
          className="w-auto"
        >
          <TabsList
            className={cn(
              variant === "home"
                ? "bg-slate-100 dark:bg-slate-800 p-1 rounded-full"
                : ""
            )}
          >
            <TabsTrigger
              value="rent"
              className={cn(
                variant === "home"
                  ? "px-6 py-2.5 rounded-full text-sm font-medium"
                  : "",
                variant === "home" && activeTab === "rent"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              For Rent
            </TabsTrigger>
            <TabsTrigger
              value="sale"
              className={cn(
                variant === "home"
                  ? "px-6 py-2.5 rounded-full text-sm font-medium"
                  : "",
                variant === "home" && activeTab === "sale"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              For Sale
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Search Bar container with ShineBorder effect */}
      <div
        className={cn(
          "relative rounded-full bg-card shadow-md dark:bg-neutral-900 overflow-hidden",
          isListings ? "shadow-none border border-border" : "p-0.5"
        )}
      >
        <ShineBorder
          className="absolute inset-0 pointer-events-none"
          shineColor={["#A07CFE", "#FE8A71", "#FFD700"]}
          borderWidth={variant === "home" ? 2 : 1}
        />

        {/* Inner content - THIS IS WHAT WE WILL UNCOMMENT NEXT IF ShineBorder RENDERS */}
        <div
          className={cn(
            "relative z-10 flex flex-col md:flex-row items-center gap-3 md:gap-2",
            "bg-card p-4 md:p-3 rounded-full",
            isListings ? "" : ""
          )}
        >
          {/* Main Search Inputs - UNCOMMENTING THIS SECTION NOW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-2 flex-grow w-full">
            <Select
              value={selectedPropertyType}
              onValueChange={setSelectedPropertyType}
            >
              <SelectTrigger className="w-full text-sm h-12 rounded-full">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-sm">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Region Combobox */}
            <Popover open={regionOpen} onOpenChange={setRegionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={regionOpen}
                  className="w-full text-sm h-12 rounded-full justify-between flex items-center"
                >
                  <span className="truncate block">
                    {selectedRegion
                      ? moroccanRegions.find(
                          (region) =>
                            region.toLowerCase() ===
                            selectedRegion.toLowerCase()
                        ) || "Select Region..."
                      : "Select Region..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[250px] md:min-w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search region..." />
                  <CommandList className="max-h-[250px]">
                    <CommandEmpty>No region found.</CommandEmpty>
                    <CommandGroup>
                      {moroccanRegions.map((region) => (
                        <CommandItem
                          key={region}
                          value={region}
                          onSelect={(currentValue) => {
                            setSelectedRegion(
                              currentValue === selectedRegion.toLowerCase()
                                ? ""
                                : currentValue
                            );
                            setSelectedCity(""); // Reset city when region changes
                            setRegionOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedRegion.toLowerCase() ===
                                region.toLowerCase()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {region}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* City Combobox */}
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cityOpen}
                  className="w-full text-sm h-12 rounded-full justify-between flex items-center"
                  disabled={
                    !selectedRegion ||
                    selectedRegion === "All Regions" ||
                    !citiesByRegion[selectedRegion]?.length
                  }
                >
                  <span className="truncate block">
                    {selectedCity
                      ? (citiesByRegion[selectedRegion] || []).find(
                          (city) =>
                            city.toLowerCase() === selectedCity.toLowerCase()
                        ) || "Select City..."
                      : "Select City..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[250px] md:min-w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList className="max-h-[250px]">
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {(citiesByRegion[selectedRegion] || []).map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={(currentValue) => {
                            setSelectedCity(
                              currentValue === selectedCity.toLowerCase()
                                ? ""
                                : currentValue
                            );
                            setCityOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCity.toLowerCase() === city.toLowerCase()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons - Grouped - UNCOMMENTING THIS SECTION NOW */}
          <div className="flex items-center gap-2 mt-3 md:mt-0 md:ml-2 w-full md:w-auto">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto h-12 rounded-full text-sm"
                  >
                    <Settings2 className="mr-2 h-4 w-4" /> Advanced
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </SheetHeader>
                  <ScrollArea className="flex-grow mt-4 pr-3">
                    <AdvancedFiltersContent />
                  </ScrollArea>
                  <SheetFooter className="mt-auto pt-4 border-t">
                    <Button
                      onClick={handleSearch}
                      className="w-full text-base py-3 h-auto"
                    >
                      <Search className="mr-2 h-4 w-4" /> Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowAdvancedDesktop(!showAdvancedDesktop)}
                className="h-12 rounded-full text-sm"
              >
                <Settings2 className="mr-2 h-4 w-4" /> Advanced
              </Button>
            )}
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto h-12 rounded-full text-sm"
            >
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          {/* 
          <div
            style={{
              padding: "20px",
              color: "lime",
              border: "1px solid lime",
              marginTop: "10px",
              width: "100%",
            }}
          >
            If you see this AND the SELECTS & BUTTONS ABOVE, these parts are
            likely working.
          </div>
          */}
        </div>
      </div>

      {/* Collapsible Advanced Panel for Desktop - REMAINS COMMENTED */}

      {!isMobile && (
        <Collapsible
          open={showAdvancedDesktop}
          onOpenChange={setShowAdvancedDesktop}
          className="relative mt-1"
        >
          <CollapsibleContent
            ref={advancedPanelRef}
            className="CollapsibleContent absolute left-0 w-full z-20 overflow-hidden"
          >
            <div className="bg-card border rounded-lg shadow-lg p-4 md:p-6 mt-2">
              <AdvancedFiltersContent />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* 
      <div
                            style={{
          color: "cyan",
          border: "1px solid cyan",
          padding: "10px",
          marginTop: "10px",
        }}
      >
        IF YOU SEE THIS, THE HANG IS IN THE COMMENTED OUT SECTION.
            </div>
      */}
    </div>
  );
}

// Ensure you have these animations in your global CSS if not part of Shadcn default:
/*
@keyframes slideDownAndFade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUpAndFade {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
}
.CollapsibleContent[data-state='open'] {
  animation: slideDownAndFade 300ms cubic-bezier(0.87, 0, 0.13, 1);
}
.CollapsibleContent[data-state='closed'] {
  animation: slideUpAndFade 300ms cubic-bezier(0.87, 0, 0.13, 1);
}
*/

// Note on moroccanRegions and citiesByRegion:
// Data for moroccanRegions and citiesByRegion should be kept as is, or moved to a constants file if preferred.
// For moroccanRegions, I added: moroccanRegions.unshift("All Regions"); to ensure "All Regions" is always an option,
// particularly if the initial selectedRegion is empty or explicitly "All Regions".
// The Select components will use their placeholder prop if the value is empty or matches the placeholder text.
// The "Rooms" and "Baths: Any" default values are handled as placeholders or actual selectable items.
