import React from "react";
import { NavLink, Link } from "react-router-dom";
import ApplicationLogo from "./ApplicationLogo";
import indonesiaFlag from "../assets/icons/id.svg";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">
              <ApplicationLogo className="" type="black" width={150} />
            </Link>
          </div>

          <nav className="flex flex-wrap items-center gap-6 md:gap-8 justify-center">
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `relative transition-colors ${isActive ? "text-[#29D9C2] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-3/4 after:h-[2px] after:bg-[#29D9C2]" : "text-gray-600 hover:text-[#29D9C2]"}`
              }
            >
              Book a Boat
            </NavLink>

            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `relative transition-colors ${isActive ? "text-[#29D9C2] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-3/4 after:h-[2px] after:bg-[#29D9C2]" : "text-gray-600 hover:text-[#29D9C2]"}`
              }
            >
              About Us
            </NavLink>

            <NavLink
              to="/support"
              className={({ isActive }) =>
                `relative transition-colors ${isActive ? "text-[#29D9C2] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-3/4 after:h-[2px] after:bg-[#29D9C2]" : "text-gray-600 hover:text-[#29D9C2]"}`
              }
            >
              Support
            </NavLink>

            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-semibold text-lg">IDR - Rp</span>
              <img src={indonesiaFlag} alt="Indonesia Flag" width={42} />
            </div>

            {!user ? (
              <div className="flex gap-3">
              <Link to="/register" className="px-5 py-2 bg-[#29D9C2] text-white rounded-lg hover:bg-[#29D9C2] hover:opacity-80 transition font-medium">
                Sign Up
              </Link>
              <Link to="/login" className="px-5 py-2 border border-[#29D9C2] text-[#29D9C2] rounded-lg hover:bg-[#29D9C2] hover:text-white transition font-medium">
                Sign In
              </Link>
            </div>
            ) : (
              <div>
                
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
