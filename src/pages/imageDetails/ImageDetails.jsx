import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  fetchImages,
  deleteImage,
  addCommentToImageAsync,
  fetchFavoriteImages,
  updateImage,
} from "../../features/imageSlice";
import {
  FaHeart,
  FaShareAlt,
  FaTrash,
  FaCommentAlt,
  FaUser,
} from "react-icons/fa";
import "./ImageDetails.css";
import { fetchAlbums } from "../../features/albumSlice";

const ImageDetails = () => {
  const { images } = useSelector((state) => state?.image);
  const { imageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state?.user);
  const albumId = location?.state?.albumId;
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // const imageDetails = images?.find((img) => {
  //   console.log("img kai", img?._id);
  //   console.log("imageId ka hai", imageId);

  //   return img?._id === imageId;
  // });
  const imageDetails = images?.find((img) => img?._id === imageId) || {};

  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const toggleImageModal = () => {
    setEditModal(!editModal);
  };

  console.log("imageId", imageId);
  console.log("albumId", albumId);
  console.log("images", images);

  console.log("imageDetails", imageDetails);

  const handleTagsChange = (e) => setTags(e.target.value);
  const handlePersonChange = (e) => setPerson(e.target.value);
  const handleFavoriteChange = (e) => setFavorite(e.target.checked);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure tags are formatted properly
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const updatedData = {
      tags: tagsArray,
      person: person,
      isFavorite: favorite,
    };

    await dispatch(updateImage({ imageId, updatedData }));
    setEditModal(false);
  };

  if (!imageDetails) {
    return <div className="container text-center mt-4">Loading...</div>;
  }

  const handleDelete = () => {
    dispatch(deleteImage({ imageId, albumId }));
    navigate(-1);
  };
  const commentHandler = () => {
    setShowModal(!showModal);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    dispatch(
      addCommentToImageAsync({
        imageId,
        albumId,
        comment,
      })
    ).then(() => {
      dispatch(fetchImages(albumId));
    });

    setComment("");
    setShowModal(false);
  };
  const favoriteHandler = () => {
    dispatch(fetchFavoriteImages({ albumId, imageId })).then((action) => {
      if (fetchFavoriteImages.fulfilled.match(action)) {
        setIsFavorite(action.payload.isFavorite);
      } else {
        console.error("Error updating favorite status:", action.error);
      }
    });
  };
  useEffect(() => {
    if (albumId) {
      dispatch(fetchImages(albumId));
      dispatch(fetchAlbums());
    }
  }, [albumId, dispatch]);

  useEffect(() => {
    if (imageDetails) {
      setTags(
        Array.isArray(imageDetails.tags) ? imageDetails.tags.join(", ") : ""
      );
      setPerson(imageDetails.person || "");
      setFavorite(imageDetails.isFavorite || false);
    }
  }, [imageDetails]);

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="card shadow-lg border-0" style={{ width: "50rem" }}>
        <img
          src={imageDetails?.imageUrl}
          className="card-img-top rounded img-fluid"
          alt={imageDetails?.name}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{imageDetails.name}</h5>
          <p className="card-text text-muted">
            <strong>Uploaded:</strong>{" "}
            {new Date(imageDetails.uploadedAt).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Size:</strong> {(imageDetails.size / 1024).toFixed(2)} KB
          </p>
          <p className="card-text">
            <strong>Tagged Person:</strong>{" "}
            {imageDetails.person ? imageDetails.person : "No person added"}
          </p>

          {imageDetails.tags &&
          imageDetails.tags.length > 0 &&
          imageDetails.tags[0] !== "" ? (
            <p className="card-text">
              <strong>Tags:</strong> {imageDetails.tags.join(", ")}
            </p>
          ) : (
            <p>No Tags Added</p>
          )}
          {imageDetails.comments && imageDetails.comments.length > 0 ? (
            <p className="card-text">
              <strong>Comments:</strong>
              <ul className="list-unstyled">
                {imageDetails?.comments?.map((c, index) => (
                  <li key={index}>
                    {user.name} : {c}
                  </li>
                ))}
              </ul>
            </p>
          ) : (
            <p className="card-text text-muted">No comments</p>
          )}

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleImageModal}
          >
            <FaUser /> Edit Image
          </button>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              className={`btn ${
                favorite ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={favoriteHandler}
            >
              <FaHeart /> {favorite ? "Unfavorite" : "Favorite"}
            </button>
            {imageDetails.isShareable && (
              <button className="btn btn-outline-primary">
                <FaShareAlt /> Share
              </button>
            )}
            <button
              className="btn btn-outline-secondary"
              onClick={commentHandler}
            >
              <FaCommentAlt /> Comment
            </button>
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* comment modal */}
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
                <h5 className="modal-title">Add Comment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={commentHandler}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    placeholder="Enter your comment..."
                    className="form-control mb-2"
                  />

                  <button type="submit" className="btn btn-success w-100">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* edit modal */}
      {editModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Image Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleImageModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={tags}
                    onChange={handleTagsChange}
                    className="form-control mb-3"
                    placeholder="Set your tags"
                  />
                  <input
                    type="text"
                    value={person}
                    onChange={handlePersonChange}
                    className="form-control mb-3"
                    placeholder="Person (if tagged)"
                  />
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

export default ImageDetails;
