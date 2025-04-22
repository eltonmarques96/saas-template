import AuthContext from "@/contexts/AuthContext";
import React, { useContext } from "react";

const Navbar: React.FC = () => {
  const { logout } = useContext(AuthContext);
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      <p onClick={() => logout()}>Logout</p>
      <ul className="navbar-nav ml-auto">
        {/* User Profile Dropdown */}
        <li className="nav-item dropdown">
          <a
            className="nav-link"
            data-toggle="dropdown"
            href="#"
            role="button"
            aria-expanded="false"
          >
            <img
              src="/path-to-profile-photo.jpg"
              alt="User Profile"
              className="img-circle elevation-2"
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
            />
          </a>
          <div
            className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
            onClick={() => logout()}
          >
            <a href="#" className="dropdown-item">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
