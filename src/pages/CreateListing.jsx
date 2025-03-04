import { useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import CustomSelect from "../components/CustomSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CreateListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bathrooms: 1,
    bedrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: [],
    propertyType: "house",
    size: 0,
    location: "",
    region: "",
    city: "",
    amenities: {
      "Bed Linens": false,
      "Carbon Alarm": false,
      "Check-in Lockbox": false,
      "Coffee Maker": false,
      Dishwasher: false,
      "Extra Pillows": false,
      "First Aid Kit": false,
      Hangers: false,
      Iron: false,
      Microwave: false,
      Refrigerator: false,
      "Security Cameras": false,
      "Smoke alarm": false,
      "TV Standard Cable": false,
    },
  });

  const {
    type,
    name,
    bathrooms,
    bedrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
    propertyType,
    size,
    location,
    region,
    city,
    amenities,
  } = formData;

  // Moroccan regions
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

  // Cities by region
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

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      const files = Array.from(e.target.files)
        .filter(
          (file) =>
            file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
        )
        .slice(0, 6);
      setFormData((prevState) => ({
        ...prevState,
        images: files,
      }));
    }
    // Checkboxes for amenities
    else if (e.target.type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        amenities: {
          ...prevState.amenities,
          [e.target.id]: e.target.checked,
        },
      }));
    }
    // Text/Boolean/Number
    else if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  const handleRegionChange = (selectedRegion) => {
    setFormData((prevState) => ({
      ...prevState,
      region: selectedRegion,
      city: "", // Reset city when region changes
    }));
  };

  const handleCityChange = (selectedCity) => {
    setFormData((prevState) => ({
      ...prevState,
      city: selectedCity,
    }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }
    if (formData.images.length === 0) {
      setLoading(false);
      toast.error("Please select at least one image");
      return;
    }
    if (formData.images.length > 6) {
      setLoading(false);
      toast.error("You can only upload up to 6 images.");
      return;
    }

    try {
      const geolocation = {};
      let location;
      if (geoLocationEnabled) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
            import.meta.env.VITE_GEOCODE_API_KEY
          }`
        );
        const data = await response.json();
        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
        location = data.status === "ZERO_RESULTS" && undefined;
        if (location === undefined) {
          setLoading(false);
          toast.error("please enter a correct address");
          return;
        }
      } else {
        geolocation.lat = latitude;
        geolocation.lng = longitude;
      }

      async function storeImage(image) {
        return new Promise((resolve, reject) => {
          if (!image) {
            reject(new Error("No image provided"));
            return;
          }

          const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
          if (!allowedTypes.includes(image.type)) {
            reject(
              new Error(
                `Invalid file type for ${image.name}. Only JPG, PNG, and WEBP are allowed.`
              )
            );
            return;
          }

          const maxSize = 2 * 1024 * 1024; // 2MB in bytes
          if (image.size > maxSize) {
            reject(new Error(`File size for ${image.name} exceeds 2MB limit.`));
            return;
          }

          const formData = new FormData();
          formData.append("file", image);
          formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
          );
          formData.append(
            "public_id",
            `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
          );

          fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.secure_url)
                throw new Error(`Upload failed for ${image.name}`);
              resolve(data.secure_url);
            })
            .catch((err) => reject(err));
        });
      }

      const imgUrls = await Promise.all(
        formData.images.map((image) => storeImage(image))
      );

      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);
      setLoading(false);
      toast.success("Listing created successfully");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setLoading(false);
      toast.error("Error creating listing. Please try again.");
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-gray-200 transition-all duration-300`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-semibold ${isSidebarOpen ? "block" : "hidden"}`}>
            Navigation
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        {/* Add your sidebar navigation items here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">
          </h1> */}

          <form onSubmit={onSubmit} className="space-y-8">
            {/* Upload Media Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload Media <span className="text-blue-500">*</span>
              </h2>
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const files = Array.from(e.dataTransfer.files)
                    .filter((file) => {
                      if (!file.type.startsWith("image/")) {
                        toast.error(`${file.name} is not an image file`);
                        return false;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error(`${file.name} is larger than 2MB`);
                        return false;
                      }
                      return true;
                    })
                    .slice(0, 10); // updated to allow up to 10
                  if (files.length > 10) {
                    toast.error("You can only upload up to 10 images");
                  }
                  setFormData((prevState) => ({
                    ...prevState,
                    images: [...prevState.images, ...files].slice(0, 10),
                  }));
                }}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-2xl font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Select photos</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-2">or drag photos here</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Up to 10 photos (PNG, JPG, JPEG up to 2MB each)
                  </p>
                </div>
              </div>
              {/* Selected images preview */}
              {formData.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from(formData.images).map((file, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 overflow-hidden rounded-xl border border-gray-200"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prevState) => ({
                            ...prevState,
                            images: prevState.images.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                        className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full text-red-500 hover:text-red-700 p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Information Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-8">
                Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Property Type & Sale/Rent */}
                <div className="space-y-8">
                  {/* Type Selection (Sell/Rent) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-blue-500">*</span>
                    </label>
                    <div className="flex gap-2 rounded-full shadow-sm border border-gray-200 transition-all duration-300">
                      <button
                        type="button"
                        id="type"
                        value="sale"
                        onClick={onChange}
                        className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                          type === "sale"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        Sell
                      </button>
                      <button
                        type="button"
                        id="type"
                        value="rent"
                        onClick={onChange}
                        className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                          type === "rent"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        Rent
                      </button>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type <span className="text-blue-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:flex ">
                      <button
                        type="button"
                        id="propertyType"
                        value="house"
                        onClick={onChange}
                        className={`px-4 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                          propertyType === "house"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 border border-gray-200"
                        }`}
                      >
                        House
                      </button>
                      <button
                        type="button"
                        id="propertyType"
                        value="apartment"
                        onClick={onChange}
                        className={`px-4 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                          propertyType === "apartment"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 border border-gray-200"
                        }`}
                      >
                        Apartment
                      </button>
                      <button
                        type="button"
                        id="propertyType"
                        value="condo"
                        onClick={onChange}
                        className={`px-4 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                          propertyType === "condo"
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 border border-gray-200"
                        }`}
                      >
                        Condo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name & Description */}
                <div className="space-y-8">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={onChange}
                      placeholder="Property Name"
                      maxLength="32"
                      minLength="10"
                      required
                      className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description <span className="text-blue-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={onChange}
                      placeholder="Property Description"
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-8">
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Region & City */}
                <div>
                  <CustomSelect
                    label={
                      <>
                        Region <span className="text-blue-500">*</span>
                      </>
                    }
                    value={region}
                    options={moroccanRegions}
                    onChange={handleRegionChange}
                    isOpen={isRegionOpen}
                    setIsOpen={setIsRegionOpen}
                    placeholder="Select Region"
                    className="w-full h-10 min-h-[40px]"
                    required
                  />
                </div>
                <div>
                  <CustomSelect
                    label={
                      <>
                        City <span className="text-blue-500">*</span>
                      </>
                    }
                    value={city}
                    options={
                      citiesByRegion[region] ||
                      Object.values(citiesByRegion).flat()
                    }
                    onChange={handleCityChange}
                    isOpen={isCityOpen}
                    setIsOpen={setIsCityOpen}
                    placeholder="Select City"
                    className="w-full h-10 min-h-[40px]"
                    required
                  />
                </div>

                {/* Neighborhood/Location */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Neighborhood / Area <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={onChange}
                    placeholder="e.g. Downtown, Suburbs, Beach Area"
                    required
                    className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address <span className="text-blue-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={onChange}
                    placeholder="Full address"
                    required
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Geolocation fields */}
                {!geoLocationEnabled && (
                  <>
                    <div>
                      <label
                        htmlFor="latitude"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Latitude <span className="text-blue-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="latitude"
                        value={latitude}
                        onChange={onChange}
                        required
                        min="-90"
                        max="90"
                        className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="longitude"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Longitude <span className="text-blue-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="longitude"
                        value={longitude}
                        onChange={onChange}
                        required
                        min="-180"
                        max="180"
                        className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Property Details Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-8">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Size */}
                <div>
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Size (m²) <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="size"
                    value={size}
                    onChange={onChange}
                    min="1"
                    max="1000"
                    required
                    placeholder="Property size in square meters"
                    className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                  />
                </div>

                {/* Beds & Baths */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bedrooms"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Beds <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      value={bedrooms}
                      onChange={onChange}
                      min="1"
                      max="50"
                      required
                      className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bathrooms"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Baths <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      value={bathrooms}
                      onChange={onChange}
                      min="1"
                      max="50"
                      required
                      className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(amenities).map((amenity) => (
                      <div className="flex items-center" key={amenity}>
                        <input
                          type="checkbox"
                          id={amenity}
                          checked={amenities[amenity]}
                          onChange={onChange}
                          className="rounded border-gray-300 text-[#1D4ED8] focus:ring-0 focus:ring-offset-0"
                        />
                        <label
                          htmlFor={amenity}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parking & Furnished */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking spot
                  </label>
                  <div className="flex gap-2 rounded-full shadow-sm border border-gray-200 transition-all duration-300">
                    <button
                      type="button"
                      id="parking"
                      value={true}
                      onClick={onChange}
                      className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                        parking
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      id="parking"
                      value={false}
                      onClick={onChange}
                      className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                        !parking
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnished
                  </label>
                  <div className="flex gap-2 rounded-full shadow-sm border border-gray-200 transition-all duration-300">
                    <button
                      type="button"
                      id="furnished"
                      value={true}
                      onClick={onChange}
                      className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                        furnished
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      id="furnished"
                      value={false}
                      onClick={onChange}
                      className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                        !furnished
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Price Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Price
              </h2>
              {/* Offer */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer
                </label>
                <div className="flex gap-2 rounded-full shadow-sm border border-gray-200 transition-all duration-300">
                  <button
                    type="button"
                    id="offer"
                    value={true}
                    onClick={onChange}
                    className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                      offer ? "bg-primary text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    id="offer"
                    value={false}
                    onClick={onChange}
                    className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-full focus:outline-none transition-all duration-300 ${
                      !offer
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Regular Price */}
              <div className="mb-4">
                <label
                  htmlFor="regularPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Regular price
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="regularPrice"
                    value={regularPrice}
                    onChange={onChange}
                    min="50"
                    max="400000000"
                    required
                    placeholder="0"
                    className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      MAD{type === "rent" ? "/month" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Discounted Price */}
              {offer && (
                <div>
                  <label
                    htmlFor="discountedPrice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Discounted price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="discountedPrice"
                      value={discountedPrice}
                      onChange={onChange}
                      min="50"
                      max="400000000"
                      required={offer}
                      placeholder="0"
                      className="w-full h-10 bg-transparent text-sm text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-0 rounded-full pr-16"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        MAD{type === "rent" ? "/month" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              className="p-6 w-full bg-primary text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Create Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
