import React from "react";
import Logo from "../assets/Logo.svg";
import LogoBlack from "../assets/Logo-Black.svg";

const ApplicationLogo = ({ className = "", width = 160, height = 40, type = "white" }) => {
  return (
    <img
      src={type === "white" ? Logo : LogoBlack }
      alt="TripNesia Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default ApplicationLogo;
