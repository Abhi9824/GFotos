import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbums, deleteAlbum } from "../../features/albumSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaShareAlt } from "react-icons/fa"; // Import icons
import { toast } from "react-toastify";
import "./Album.css";

const Album = () => {
  const dispatch = useDispatch();
  const { albums } = useSelector((state) => state.album);
  const { user } = useSelector((state) => state.user);

  const [showModal, setShowModal] = useState(false);
  const [sharedUser, setSharedUsers]=useState([])

  const shareHandler = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (!albums.length) {
      dispatch(fetchAlbums());
    }
  }, [dispatch, albums.length]);

  const handleDelete = (albumId) => {
    const toastId = toast.warn(
      <div>
        <p className="mb-2">Are you sure you want to delete this album?</p>
        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={() => {
              dispatch(deleteAlbum(albumId));
              toast.dismiss(toastId);
              toast.success("✅ Album deleted successfully!");
            }}
            className="btn btn-danger btn-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="btn btn-secondary btn-sm"
          >
            No, Cancel
          </button>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📸 My Albums</h2>
      <div className="row g-4">
        {albums.map((album) => {
          const imageUrl =
            album.images.length > 0
              ? album.images[0].imageUrl
              : "/no_photo.jpg";

          return (
            <div className="col-md-4 col-sm-6" key={album._id}>
              <div className="card shadow-lg border-0 h-100">
                <img
                  src={imageUrl}
                  className="card-img-top img-fluid rounded-top"
                  alt={album.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center fw-bold">
                    {album.name}
                  </h5>
                  <p className="card-text text-muted text-center">
                    {album.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-auto text-center">
                    <Link
                      to={`/images/albums/${album._id}/images`}
                      className="btn viewBtn w-100 mb-2"
                      state={{ album }}
                    >
                      View Album
                    </Link>

                    {user?.userId === album?.ownerId?._id ? (
                      <div className="d-flex justify-content-center gap-4">
                        <Link
                          to={`/albums/${album._id}`}
                          className="btn editBtn"
                          state={{ album }}
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn deleteBtn"
                          onClick={() => handleDelete(album?._id)}
                        >
                          <FaTrash />
                        </button>
                        <button className="btn shareBtn">
                          <FaShareAlt />
                        </button>
                      </div>
                    ) : (
                      <button className="btn noAccessBtn w-100" disabled>
                        🚫 No Access to Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share Album</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={shareHandler}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <label className="mb-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={favorite}
                      onChange={handleFavoriteChange}
                      className="me-2"
                    />
                    Mark as Favorite
                  </label>
                  <button type="submit" className="btn btn-success w-100">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Album;
