import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Move, Pencil, Trash2 } from "lucide-react";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <div className="group overflow-hidden rounded-[16px] border border-gray-200 bg-white w-full max-w-[440px] shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/category/${listing.type}/${id}`} className="block">
        <div className="relative overflow-hidden h-[260px] w-full">
          <img
            src={listing.imgUrls[0] || "/placeholder.svg"}
            alt={listing.name || "Property"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Left Badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            {listing.featured && (
              <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                Featured
              </span>
            )}
            <span className="rounded-full bg-gray-500/90 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-600">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>

          {/* Bottom Overlay with Address */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <MapPin className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium truncate">
              {listing.address || "Address Unavailable"}
            </span>
          </div>

          {/* Edit / Delete Overlay */}
          {(onEdit || onDelete) && (
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(id);
                  }}
                  className="rounded-full bg-gray-500 p-2 text-white transition-colors hover:bg-gray-600"
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
                  className="rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
                  aria-label="Delete listing"
                >
                  <Trash2 className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
            {listing.name || "Property Title"}
          </h3>

          <div className="flex items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              <span className="text-sm">Beds: {listing.bedrooms || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span className="text-sm">
                Baths: {listing.bathrooms || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Move className="h-5 w-5" />
              <span className="text-sm">Sqft: {listing.sqft || "N/A"}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/placeholder-avatar.svg"
                  alt="Agent"
                  width={44}
                  height={44}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">
                  Agent Name
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" && " / month"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
