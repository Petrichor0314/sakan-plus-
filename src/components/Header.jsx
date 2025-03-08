import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  UserCircle2,
  Upload,
  ArrowDownRight,
  Menu,
  X,
} from "lucide-react";

function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setPageState(user ? "Profile" : "Sign in");
    });
  }, [auth]);

  const toggleMobileDropdown = (itemName) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "Listing",
      path: "/listings",
      hasDropdown: true,
      dropdownItems: [
        { name: "All Listings", params: "" },
        { name: "For Rent", params: "?type=rent" },
        { name: "For Sale", params: "?type=sale" },
        { name: "Houses", params: "?propertyType=house" },
        { name: "Apartments", params: "?propertyType=apartment" },
        { name: "Condos", params: "?propertyType=condo" },
      ],
    },
    {
      name: "Dashboard",
      path: "/profile",
      hasDropdown: true,
      dropdownItems: [
        { name: "Dashboard", path: "/profile" },
        { name: "Add Property", path: "/create-listing" },
      ],
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="text-xl font-semibold text-gray-900">
              Home Lengo
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <div
                    key={item.path}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center gap-1.5 text-gray-700 text-[15px] font-medium py-8 group-hover:text-blue-600"
                    >
                      <span className="relative">
                        {item.name}
                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
                      </span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </Link>

                    {/* Desktop Dropdown Menu */}
                    {item.hasDropdown && activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                        {(item.dropdownItems || []).map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={
                              dropdownItem.path ||
                              `/listings${dropdownItem.params}`
                            }
                            className="group/item flex items-center px-4 py-2.5 text-sm text-gray-700"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <ArrowDownRight className="w-4 h-4 text-blue-600 opacity-0 mr-2 ease-in-out transition-all duration-200 group-hover/item:opacity-100" />
                            <span className="transform transition-all ease-in-out duration-200 group-hover/item:translate-x-2">
                              {dropdownItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center ml-8 space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-white hover:bg-blue-600 duration-200 ease-in-out transition-colors text-[15px] font-medium border border-gray-200 rounded-full px-6 py-2.5"
                >
                  <UserCircle2 className="w-5 h-5" />
                  {pageState}
                </Link>
                <Link
                  to="/create-listing"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-[15px] font-medium transition-colors duration-200"
                >
                  <Upload className="w-5 h-5" />
                  Submit Property
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.path}>
                    <button
                      className="w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      onClick={() => {
                        if (item.hasDropdown) {
                          toggleMobileDropdown(item.name);
                        } else {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDown
                            className={`w-4 h-4 transform transition-transform duration-200 ${
                              mobileDropdowns[item.name] ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {item.hasDropdown && mobileDropdowns[item.name] && (
                      <div className="pl-4 space-y-1 mt-1 bg-gray-50 rounded-md">
                        {(item.dropdownItems || []).map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={
                              dropdownItem.path ||
                              `/listings${dropdownItem.params}`
                            }
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setMobileDropdowns({});
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Action Buttons */}
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-[15px] font-medium border border-gray-200 rounded-full px-6 py-2.5 justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle2 className="w-5 h-5" />
                    {pageState}
                  </Link>
                  <Link
                    to="/create-listing"
                    className="flex items-center gap-2b g-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-[15px] font-medium transition-colors duration-200 justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Upload className="w-5 h-5" />
                    Submit Property
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer to reserve header height */}
      <div className="h-20"></div>
    </>
  );
}

export default Header;
