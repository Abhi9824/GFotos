import React from "react";
import { Link } from "react-router-dom";
import { PiGooglePhotosLogoDuotone } from "react-icons/pi";
import "./Navbar.css"; // Import external CSS for styling
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { FaUserPlus } from "react-icons/fa6";
import { FiPlusSquare } from "react-icons/fi";

const Navbar = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand fs-3 fw-semibold text-white" to="/">
          GFotos
          <span>
            <PiGooglePhotosLogoDuotone className="icon-brand" />
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <Link className="nav-link text-white">
                <FaUserPlus />
              </Link>
            ) : (
              <div className="d-flex gap-2">
                <Link className="nav-link text-white" to="/albums/add/album">
                  <div className="d-flex gap-1">
                    <FiPlusSquare className="icon" />
                    <span>Add Albums</span>
                  </div>
                </Link>
                <Link className="nav-link text-white" to="/">
                  <div className="d-flex gap-1">
                    <span>All Albums</span>
                  </div>
                </Link>
                <Link className="nav-link text-white" to="/auth/profile">
                  <div className="d-flex gap-1">
                    <CgProfile className="icon" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
