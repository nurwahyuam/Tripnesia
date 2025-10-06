import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import ApplicationLogo from "./ApplicationLogo";
import indonesiaFlag from "../assets/icons/id.svg";
import NavItem from "./NavItem";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
  const { user, role } = useAuth();
  const { handleLogout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);
  const closeProfile = () => setIsProfileOpen(false);

  const name = user?.name?.slice(0, 2).toUpperCase() || "US";

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Handle logout dengan menutup menu
  const handleLogoutClick = () => {
    handleLogout();
    closeMenu();
  };

  // Tentukan route logo berdasarkan role
  const getLogoRoute = () => {
    return role === "admin" ? "/admin/dashboard" : "/";
  };

  // Tentukan width logo berdasarkan role
  const getLogoWidth = () => {
    return role === "admin" ? 50 : 150;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        {/* Logo */}
        <Link to={getLogoRoute()} onClick={closeMenu} className="flex items-center">
          <ApplicationLogo type="black" width={getLogoWidth()} role={role} />
          {role === "admin" && <span className="ml-4 text-xl font-bold text-gray-800">TripNesia Admin</span>}
        </Link>

        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#29D9C2] rounded-lg p-1" aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Content */}
        {role !== "admin" ? (
          <>
            {/* Desktop menu - Non Admin */}
            <nav className="hidden md:flex items-center gap-8">
              <NavItem to="/product" label="Book a Boat" currentPath={location.pathname} />
              <NavItem to="/about-us" label="About Us" currentPath={location.pathname} />
              <NavItem to="/support" label="Support" currentPath={location.pathname} />

              {/* Currency & Flag */}
              <div className="flex items-center gap-3">
                <span className="text-gray-800 font-semibold text-lg">IDR - Rp</span>
                <img src={indonesiaFlag} alt="Indonesia Flag" width={32} height={32} className="w-8 h-8" />
              </div>

              {/* Auth Section */}
              {!user ? (
                <div className="flex gap-3">
                  <Link to="/register" className="px-5 py-2 bg-[#29D9C2] text-white rounded-lg hover:bg-[#22c1ab] transition font-medium">
                    Sign Up
                  </Link>
                  <Link to="/login" className="px-5 py-2 border border-[#29D9C2] text-[#29D9C2] rounded-lg hover:bg-[#29D9C2] hover:text-white transition font-medium">
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border border-gray-300 rounded-full pr-4">
                    <div className="bg-[#29D9C2] text-white w-10 h-10 rounded-full flex justify-center items-center font-semibold">{name}</div>
                    <h1 className="font-semibold text-gray-800">{user.name}</h1>
                  </div>
                  <button onClick={handleLogoutClick} className="border border-gray-300 p-2.5 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition" title="Logout" aria-label="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile menu - Non Admin */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 md:hidden bg-white border-t shadow-inner">
                <nav className="flex flex-col px-6 py-4 space-y-4">
                  <NavItem to="/product" label="Book a Boat" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/about-us" label="About Us" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/support" label="Support" onClick={closeMenu} currentPath={location.pathname} mobile />

                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-gray-800 font-semibold text-lg">IDR - Rp</span>
                    <img src={indonesiaFlag} alt="Indonesia Flag" width={32} height={32} className="w-8 h-8" />
                  </div>

                  {!user ? (
                    <div className="flex flex-col gap-3 pt-4">
                      <Link to="/register" onClick={closeMenu} className="px-5 py-2 bg-[#29D9C2] text-white rounded-lg text-center hover:bg-[#22c1ab] transition font-medium">
                        Sign Up
                      </Link>
                      <Link to="/login" onClick={closeMenu} className="px-5 py-2 border border-[#29D9C2] text-[#29D9C2] rounded-lg text-center hover:bg-[#29D9C2] hover:text-white transition font-medium">
                        Sign In
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#29D9C2] text-white w-9 h-9 rounded-full flex justify-center items-center font-semibold">{name}</div>
                        <h1 className="font-semibold">{user.name}</h1>
                      </div>
                      <button onClick={handleLogoutClick} className="border border-gray-300 p-2 rounded-full hover:bg-red-600 hover:text-white transition" title="Logout">
                        <LogOut className="w-6 h-6 p-1" />
                      </button>
                    </div>
                  )}
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Desktop menu - Admin */}
            <nav className="hidden md:flex items-center gap-6">
              <NavItem to="/admin/dashboard" label="Dashboard" currentPath={location.pathname} />
              <NavItem to="/admin/users" label="Users" currentPath={location.pathname} />
              <NavItem to="/admin/ships" label="Ships" currentPath={location.pathname} />
              <NavItem to="/admin/cabins" label="Cabins" currentPath={location.pathname} />
              <NavItem to="/admin/bookings" label="Bookings" currentPath={location.pathname} />
              <NavItem to="/admin/transactions" label="Transactions" currentPath={location.pathname} />
              <NavItem to="/admin/promos" label="Promos" currentPath={location.pathname} />
            </nav>
            {/* Desktop user section - Admin */}
            <div className="hidden md:flex items-center gap-4 relative">
              <button onClick={toggleProfile} className="flex items-center gap-2 border border-gray-300 rounded-full pr-4 hover:bg-gray-50 transition">
                <div className="bg-[#29D9C2] text-white w-10 h-10 rounded-full flex justify-center items-center font-semibold">{name}</div>
                <h1 className="font-semibold text-gray-800">{user?.name}</h1>
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      closeProfile();
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            {/* Mobile menu - Admin */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 md:hidden bg-white border-t shadow-inner">
                <nav className="flex flex-col px-6 py-4 space-y-3 w-full">
                  <NavItem to="/admin/dashboard" label="Dashboard" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/admin/users" label="Users" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/admin/ships" label="Ships" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/admin/cabins" label="Cabins" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/admin/bookings" label="Bookings" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/admin/transactions" label="Transactions" onClick={closeMenu} currentPath={location.pathname} mobile />
                  <NavItem to="/admin/promos" label="Promos" onClick={closeMenu} currentPath={location.pathname} mobile />

                  <div className="border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#29D9C2] text-white w-9 h-9 rounded-full flex justify-center items-center font-semibold">{name}</div>
                      <h1 className="font-semibold">{user?.name}</h1>
                    </div>
                    <button onClick={handleLogoutClick} className="border border-gray-300 p-2 rounded-full hover:bg-red-600 hover:text-white transition" title="Logout">
                      <LogOut className="w-6 h-6 p-1" />
                    </button>
                  </div>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
