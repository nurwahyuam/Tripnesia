import React from "react";
import Logo from "../assets/Logo.svg";
import LogoBlack from "../assets/Logo-Black.svg";
import LogoAdmin from "../assets/Logo-Admin.svg";

const ApplicationLogo = ({ className = "", width = 160, height = 40, type = "white", role = 'customer' }) => {
  return (
    <img
      src={role !== "admin" ? type === "white" ? Logo : LogoBlack : LogoAdmin}
      alt="TripNesia Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default ApplicationLogo;
