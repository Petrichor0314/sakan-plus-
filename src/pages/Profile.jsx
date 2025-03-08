import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Edit2,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [activeSection, setActiveSection] = useState(
    searchParams.get("section") || "profile"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const section = searchParams.get("section");
    setActiveSection(section || "profile");
  }, [searchParams]);

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".listing-menu")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const { name, email } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Could not update your profile");
    }
  }

  async function onDelete(id) {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteDoc(doc(db, "listings", id));
      const updatedListings = listings.filter((listing) => listing.id !== id);
      setListings(updatedListings);
      toast.success("Listing deleted successfully");
      setActiveMenu(null);
    }
  }

  function onEdit(id) {
    navigate(`/edit-listing/${id}`);
    setActiveMenu(null);
  }

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                My Profile
              </h2>

              {/* Profile Card */}
              <div className="space-y-6">
                {/* User Info Section */}
                <div className="pb-6 border-b border-gray-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                  >
                    <div className="space-y-4">
                      {/* Name Field */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            value={name}
                            disabled={!changeDetail}
                            onChange={onChange}
                            className={`w-full h-10 px-4 rounded-full border ${
                              changeDetail
                                ? "border-primary"
                                : "border-gray-200"
                            } focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              changeDetail && onSubmit();
                              setChangeDetail((prevState) => !prevState);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <Edit2
                              className={`h-4 w-4 ${
                                changeDetail ? "text-primary" : "text-gray-400"
                              } hover:text-primary transition-colors`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          disabled
                          className="w-full h-10 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Account Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/create-listing")}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create New Listing</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "listings":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                My Listings
              </h2>
              <button
                onClick={() => navigate("/create-listing")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add Property</span>
              </button>
            </div>

            {!loading && listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 relative"
                  >
                    <div className="listing-menu absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(
                            activeMenu === listing.id ? null : listing.id
                          );
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {activeMenu === listing.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <button
                            onClick={() => onEdit(listing.id)}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit Listing
                          </button>
                          <button
                            onClick={() => onDelete(listing.id)}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Listing
                          </button>
                        </div>
                      )}
                    </div>

                    <ListingItem id={listing.id} listing={listing.data} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <Home className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No Listings Yet
                  </h3>
                  <p className="text-gray-500">
                    Create your first property listing to get started
                  </p>
                  <button
                    onClick={() => navigate("/create-listing")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create New Listing</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <Spinner />;

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}

export default Profile;
