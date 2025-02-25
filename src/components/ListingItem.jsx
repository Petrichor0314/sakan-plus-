import { Link } from "react-router-dom";
import {
  MapPin,
  Home,
  Building,
  BedDouble,
  Bath,
  Car,
  Sofa,
  Pencil,
  Trash2,
  Square,
} from "lucide-react";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="group relative overflow-hidden rounded-3xl bg-white">
      <Link to={`/category/${listing.type}/${id}`} className="block">
        {/* Image Container */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={listing.imgUrls[0] || "/placeholder.svg"}
            alt="Property"
            loading="lazy"
          />

          {/* Status Badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
              Featured
            </span>
            <span className="rounded-full bg-gray-600/70 px-4 py-1 text-sm font-medium text-white">
              For {listing.type === "rent" ? "Rent" : "Sale"}
            </span>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2">
            <MapPin className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              {listing.address}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {listing.name}
          </h3>

          {/* Property Details */}
          <div className="mt-4 flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              <span className="text-sm">Beds: {listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span className="text-sm">Baths: {listing.bathrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              <span className="text-sm">Sqft: {listing.sqft || "1529"}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 text-2xl font-bold text-gray-900">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </div>
        </div>
      </Link>

      {/* Edit/Delete Overlay - if needed */}
      {(onEdit || onDelete) && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit(id);
              }}
              className="rounded-full bg-gray-500 p-2 text-white transition-colors"
              aria-label="Edit listing"
            >
              <Pencil className="h-6 w-6" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(id);
              }}
              className="rounded-full bg-blue-500 p-2 text-white transition-colors"
              aria-label="Delete listing"
            >
              <Trash2 className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
