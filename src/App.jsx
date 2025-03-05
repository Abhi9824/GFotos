import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Loading from "./components/Loading/Loading";
import { RequireAuth } from "./utils/auth";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/Profile";
import AddAlbum from "./pages/addAlbum/AddAlbum";
import { fetchProfile } from "./features/userSlice";
import EditAlbum from "./pages/editAlbum/EditAlbum";
import ImageList from "./components/Images/ImageList";
import ImageDetails from "./pages/imageDetails/imageDetails";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      dispatch(fetchProfile());
    }
  }, []);
  return (
    <div className="main-container">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        draggable
      />
      <Navbar />
      {status === "loading" ? (
        <Loading />
      ) : (
        <>
          <div className="route-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route
                path="/auth/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />

              <Route
                path="/albums/add/album"
                element={
                  <RequireAuth>
                    <AddAlbum />
                  </RequireAuth>
                }
              />
              <Route
                path="/albums/:albumId"
                element={
                  <RequireAuth>
                    <EditAlbum />
                  </RequireAuth>
                }
              />
              <Route
                path="/images/albums/:albumId/images"
                element={
                  <RequireAuth>
                    <ImageList />
                  </RequireAuth>
                }
              />
              <Route
                path="/albums/:albumId/images/:imageId"
                element={
                  <RequireAuth>
                    <ImageDetails />
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
