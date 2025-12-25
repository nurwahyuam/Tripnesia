import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CustomerLayout = ({ children, hideNavbar = false }) => {
  return (
    <div>
      {!hideNavbar && <Navbar />}
      {children}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
