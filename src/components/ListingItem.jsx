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
} from "lucide-react";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="group relative overflow-hidden rounded-3xl bg-white">
      <Link to={`/category/${listing.type}/${id}`} className="block">
        <div className="relative">
          <div className="relative h-[300px] w-full overflow-hidden">
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              src={listing.imgUrls[0] || "/placeholder.svg"}
              alt="Property"
              loading="lazy"
            />

            {/* Status Badge */}
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
              {listing.type === "rent" ? (
                <Building className="h-4 w-4" />
              ) : (
                <Home className="h-4 w-4" />
              )}
              For {listing.type === "rent" ? "Rent" : "Sale"}
            </div>

            {/* Edit / Delete Overlay */}
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
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="truncate">{listing.address}</span>
          </div>

          <h3 className="mt-2 text-2xl font-medium text-gray-900">
            {listing.name}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span>Beds: {listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              <span>Baths: {listing.bathrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span>{listing.parking ? "Parking" : "No Parking"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sofa className="h-4 w-4" />
              <span>{listing.furnished ? "Furnished" : "Unfurnished"}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              MAD{listing.type === "rent" && " / month"}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
