import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, addImage } from "../../features/imageSlice";
import { fetchAlbums } from "../../features/albumSlice";
import { useParams, Link } from "react-router-dom";
import "./ImageList.css";
import Loading from "../Loading/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImageList = () => {
  const dispatch = useDispatch();
  const { albumId } = useParams();
  const { albums, albumStatus } = useSelector((state) => state.album);

  // Tracking the current album state separately
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [showFavorites, setShowFavorites] = useState(false);

  const toggleFavorites = () => {
    setShowFavorites((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchImages(albumId));
  }, []);

  useEffect(() => {
    const foundAlbum = albums.find((album) => album?._id === albumId);
    setCurrentAlbum(foundAlbum);
  }, [albums, albumId]);

  const toggleImageModal = () => {
    setShow(!show);
  };

  // const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 5242880) {
        // 5MB in bytes
        toast.warn("File size exceeds 5MB! Please upload a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleTagsChange = (e) => setTags(e.target.value);
  const handlePersonChange = (e) => setPerson(e.target.value);
  const handleFavoriteChange = (e) => setIsFavorite(e.target.checked);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    tags.split(",").forEach((tag) => formData.append("tags[]", tag.trim()));
    formData.append("person", person);
    formData.append("isFavorite", isFavorite);

    await dispatch(addImage({ albumId, formData })).then(() => {
      dispatch(fetchAlbums());
      dispatch(fetchImages(albumId));
      setShow(false);
    });
  };

  const filteredImages = showFavorites
    ? currentAlbum?.images?.filter((img) => img.isFavorite) || []
    : currentAlbum?.images || [];

  if (albumStatus === "loading" || !albums.length) return <Loading />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center py-2 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2 gap-2 w-100">
          <div>
            <h2 className="mb-3 mb-md-0 fw-semibold">
              📷 {currentAlbum?.name}
            </h2>
          </div>
          <div className="d-flex gap-3 ms-auto">
            {" "}
            {/* Added ms-auto */}
            <button
              className="btn btn-secondary w-md-auto"
              onClick={toggleFavorites}
            >
              {showFavorites ? "Show All" : "Show Favorites"}
            </button>
            <button
              className="btn sumitBtn w-md-auto"
              onClick={toggleImageModal}
            >
              Upload Image
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {filteredImages && filteredImages?.length > 0 ? (
          filteredImages.map((img) => (
            <div key={img._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <Link
                to={`/albums/${currentAlbum?._id}/images/${img?._id}`}
                className="image-link"
                state={{ albumId: currentAlbum?._id }}
              >
                <div className="card image-card">
                  <div className="image-container">
                    <img
                      src={img.imageUrl}
                      alt={img.name}
                      className="card-img-top"
                    />
                    <div className="overlay">
                      <div className="overlay-content">
                        <h5>{img.name}</h5>
                        <p>{new Date(img.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-12 d-flex justify-content-center">
            <div className="card text-center p-4 empty-album-card">
              <img
                src="/no_img.jpg"
                alt="No images"
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: "150px" }}
              />
              <h4 className="mt-3">Album is Empty</h4>
              <p>Upload your favorite memories to this album!</p>
              <button
                className="btn btn-primary mt-2"
                onClick={toggleImageModal}
              >
                Upload Images
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modal for Uploading Image */}
      {show && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload New Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleImageModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control mb-3"
                  />
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
                      checked={isFavorite}
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

export default ImageList;
