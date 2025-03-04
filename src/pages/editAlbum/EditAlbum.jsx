import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { updateAlbumAsync } from "../../features/albumSlice";
import "./EditAlbum.css";

const EditAlbum = () => {
  const { albumId } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (state?.album) {
      setName(state.album.name);
      setDescription(state.album.description);
    }
  }, [state]);

  const albumUpdateHandler = async (e) => {
    e.preventDefault();
    const updatedAlbum = { name, description };

    await dispatch(updateAlbumAsync({ albumId, albumData: updatedAlbum })).then(
      () => {
        navigate("/");
      }
    );
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="col-lg-5 col-md-7 col-sm-9">
        <div className="card p-4 shadow-lg rounded bg-light-subtle">
          <h3 className="text-center mb-3 fw-bold headingColor">
            ✏️ Edit Album
          </h3>
          <form onSubmit={albumUpdateHandler}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="name">
                Album Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter album name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter album description"
                rows="3"
              />
            </div>
            <button type="submit" className="btn w-100 fw-semibold sumitBtn">
              💾 Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAlbum;
