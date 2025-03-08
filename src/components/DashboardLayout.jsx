import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  Plus,
  LogOut,
} from "lucide-react";
import { getAuth } from "firebase/auth";

export default function DashboardLayout({ children }) {
  // Get sidebar state from localStorage or default to true
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Handle responsive behavior
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

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Added fixed positioning */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-gray-200 transition-all duration-300 fixed top-20 left-0 h-screen overflow-y-auto`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-semibold ${isSidebarOpen ? "block" : "hidden"}`}>
            Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 px-2">
          <Link
            to="/profile"
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-2 ${
              location.pathname === "/profile" && !location.search
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="h-5 w-5" />
            {isSidebarOpen && <span>Profile</span>}
          </Link>

          <Link
            to="/profile?section=listings"
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-2 ${
              location.search === "?section=listings"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="h-5 w-5" />
            {isSidebarOpen && <span>My Listings</span>}
          </Link>

          <Link
            to="/create-listing"
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-2 ${
              location.pathname === "/create-listing"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Plus className="h-5 w-5" />
            {isSidebarOpen && <span>Create Listing</span>}
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Sign out</span>}
          </button>
        </nav>
      </div>

      {/* Main Content - Added margin to prevent content from hiding under sidebar */}
      <div
        className={`flex-1 p-8 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
