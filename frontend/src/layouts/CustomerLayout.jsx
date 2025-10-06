import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CustomerLayout = ({children}) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
