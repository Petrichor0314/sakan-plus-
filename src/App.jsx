import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";
import { Bounce, ToastContainer } from "react-toastify";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import EditListing from "./pages/EditListing";
import NotFound from "./pages/NotFound";
import Category from "./pages/Category";
import Listings from "./pages/Listings";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="create-listing" element={<CreateListing />} />
            <Route path="edit-listing/:listingId" element={<EditListing />} />
          </Route>

          {/* Public Routes */}
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="offers" element={<Offers />} />
          <Route path="listings" element={<Listings />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route
            path="category/:categoryName/:listingId"
            element={<Listing />}
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
