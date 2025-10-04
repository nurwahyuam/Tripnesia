import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import ApplicationLogo from "./ApplicationLogo";
import indonesiaFlag from "../assets/icons/id.svg";
import { useAuth } from "../hooks/useAuth";
import NavItem from "./NavItem";

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMenu}>
          <ApplicationLogo type="black" width={150} />
        </Link>

        {/* Mobile button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItem to="/product" label="Book a Boat" />
          <NavItem to="/about-us" label="About Us" />
          <NavItem to="/support" label="Support" />

          <div className="flex items-center gap-3">
            <span className="text-gray-800 font-semibold text-lg">IDR - Rp</span>
            <img src={indonesiaFlag} alt="Indonesia Flag" width={42} />
          </div>

          {!user ? (
            <div className="flex gap-3">
              <Link
                to="/register"
                className="px-5 py-2 bg-[#29D9C2] text-white rounded-lg hover:opacity-80 transition font-medium"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 border border-[#29D9C2] text-[#29D9C2] rounded-lg hover:bg-[#29D9C2] hover:text-white transition font-medium"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 relative border border-gray-300 rounded-full px-2 py-1">
              <User className="bg-[#29D9C2] text-white w-8 h-8 p-1 rounded-full" />
              <h1 className="pr-2 font-semibold">{user.name}</h1>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-inner">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            <NavItem to="/product" label="Book a Boat" onClick={closeMenu} />
            <NavItem to="/about-us" label="About Us" onClick={closeMenu} />
            <NavItem to="/support" label="Support" onClick={closeMenu} />

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-gray-800 font-semibold text-lg">IDR - Rp</span>
              <img src={indonesiaFlag} alt="Indonesia Flag" width={42} />
            </div>

            {!user ? (
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="px-5 py-2 bg-[#29D9C2] text-white rounded-lg text-center hover:opacity-80 transition font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="px-5 py-2 border border-[#29D9C2] text-[#29D9C2] rounded-lg text-center hover:bg-[#29D9C2] hover:text-white transition font-medium"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-t pt-4">
                <User className="bg-[#29D9C2] text-white w-9 h-9 p-2 rounded-full" />
                <h1 className="font-semibold">{user.name}</h1>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
