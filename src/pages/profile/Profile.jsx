import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/userSlice"; // Adjust path as needed
import "./Profile.css"; // Custom CSS file

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="profile-container">
      {user ? (
        <div className="card shadow-lg text-center">
          <div className="card-body">
            <h3 className="card-title">{user.name}</h3>
            <p className="card-text text-muted">{user.email}</p>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted">No user logged in</p>
      )}
    </div>
  );
};

export default Profile;
