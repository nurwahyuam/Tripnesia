import React from "react";
import { useLogout } from "../../hooks/useLogout";

const Dashboard = () => {
  const { handleLogout } = useLogout();


  return (
    <>
      <div>Dashboard</div>
      <button className="bg-amber-300" type="button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default Dashboard;
