import React from "react";
import { useLogout } from "../../hooks/useLogout";

const Dashboard = () => {
  const { handleLogout } = useLogout();


  return (
    <>
      <div>Dashboard Admin</div>
      <button 
        onClick={handleLogout} 
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </>
  );
};

export default Dashboard;
