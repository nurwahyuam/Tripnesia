import React from "react";
import Navbar from "../components/Navbar";

const AdminLayout = ({children}) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default AdminLayout;
