import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const GuestLayout = ({ children, hideNavbar = false }) => {
  return (
    <div>
      {!hideNavbar && <Navbar />}
      {children}
      <Footer />
    </div>
  );
};

export default GuestLayout;
