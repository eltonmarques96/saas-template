import Navbar from "@/components/dashboard/navbar";
import AuthContext from "@/contexts/AuthContext";
import React, { useContext } from "react";

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="hold-transition" style={{ minHeight: "100vh" }}>
      <Navbar />
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!{user?.email}</p>
    </div>
  );
};

export default Dashboard;
