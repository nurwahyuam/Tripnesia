import React from 'react'
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, label, onClick, mobile }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative transition-colors block py-1 ${
        isActive
          ? "text-[#29D9C2] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-[#29D9C2] " + (mobile ? "after:w-[10%]" : "after:w-3/4")
          : "text-gray-600 hover:text-[#29D9C2]"
      }`
    }
  >
    {label}
  </NavLink>
);

export default NavItem;