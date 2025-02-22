"use client";

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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit2, LogOut, Plus } from "lucide-react"; // Changed to Lucide icons
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { Button } from "@/components/ui/button"; // Import Button component
import { Input } from "@/components/ui/input"; // Import Input component

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

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
    }
  }

  function onEdit(id) {
    navigate(`/edit-listing/${id}`);
  }

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Profile Info */}
        <div className="bg-white">
          <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="space-y-4 max-w-md">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    disabled={!changeDetail}
                    onChange={onChange}
                    className="pr-10 max-w-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      changeDetail && onSubmit();
                      setChangeDetail((prevState) => !prevState);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400 hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                  className="bg-gray-100 max-w-sm"
                />
              </div>
            </div>
          </form>
          <div className="mt-6 flex items-center gap-4">
            <Button
              type="button"
              onClick={onLogout}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
            <Link
              to="/create-listing"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105 inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Link>
          </div>
        </div>

        {/* My Listings */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Listings</h2>
          {listings && listings.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no listings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
