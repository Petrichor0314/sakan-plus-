import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setPageState(user ? "Profile" : "Sign in");
    });
  }, [auth]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Offers", path: "/offers" },
  ];

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // If scrolled down any amount, hide the navbar.
      if (window.scrollY > 0) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } bg-white/80 backdrop-blur-md shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-nav-text text-2xl font-semibold tracking-tight hover:text-nav-hover transition-colors"
            >
              Sakan+
            </Link>
            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  className="text-nav-text hover:text-nav-hover transition-colors text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/profile"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105"
              >
                {pageState}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to reserve header height */}
      <div className="h-20"></div>
    </>
  );
}

export default Header;
