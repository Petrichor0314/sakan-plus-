"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const CreateListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
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
  } = formData;

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
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

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
    <div className="min-h-screen bg-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full px-4">
        <div className="relative p-8 bg-gray-50 shadow-sm rounded-3xl sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create a Listing
          </h1>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
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

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
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
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description - New Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={onChange}
                placeholder="Property Description"
                required
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Beds & Baths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Beds
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onChange}
                  min="1"
                  max="50"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Baths
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onChange}
                  min="1"
                  max="50"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Parking & Furnished */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={onChange}
                placeholder="Address"
                required
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Geolocation fields */}
            {!geoLocationEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    value={latitude}
                    onChange={onChange}
                    required
                    min="-90"
                    max="90"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    value={longitude}
                    onChange={onChange}
                    required
                    min="-180"
                    max="180"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg"
                {...{
                  onDragOver: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  },
                  onDrop: (e) => {
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
                      .slice(0, 6);
                    if (files.length > 6) {
                      toast.error("You can only upload up to 6 images");
                    }
                    setFormData((prevState) => ({
                      ...prevState,
                      images: [...prevState.images, ...files].slice(0, 6),
                    }));
                  },
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
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        onChange={onChange}
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 2MB (max 6 files)
                  </p>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.images.length} file(s) selected
                  </p>
                  <ul className="mt-1 text-xs text-gray-500">
                    {Array.from(formData.images).map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </span>
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
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Offer */}
            <div>
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
                    !offer ? "bg-primary text-white" : "bg-white text-gray-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Regular Price */}
            <div>
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
                  className="w-full px-4 py-3 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
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
                    className="w-full px-4 py-3 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      MAD{type === "rent" ? "/month" : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
