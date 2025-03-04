import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAlbum } from "../../features/albumSlice";
import "./AddAlbum.css";

const AddAlbum = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const albumsubmitHandler = async (e) => {
    e.preventDefault();

    const albumData = { name, description };

    await dispatch(createAlbum(albumData)).then(() => {
      navigate("/");
    });
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="col-lg-5 col-md-7 col-sm-9">
        <div className="card p-4 shadow-lg rounded bg-light-subtle">
          <h3 className="text-center mb-3 fw-bold headingColor">
            📸 Create New Album
          </h3>
          <form onSubmit={albumsubmitHandler}>
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
              📷 Create Album
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAlbum;
