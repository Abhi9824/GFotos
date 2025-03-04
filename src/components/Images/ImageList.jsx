import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, addImage } from "../../features/imageSlice";
import { fetchAlbums } from "../../features/albumSlice";
import { useParams, Link } from "react-router-dom";
import "./ImageList.css"; // Import custom CSS

const ImageList = () => {
  const dispatch = useDispatch();
  const { albumId } = useParams();
  const { images, imageStatus, imageError } = useSelector(
    (state) => state.image
  );
  const { albums, albumStatus } = useSelector((state) => state.album);

  // 🔹 Track the current album state separately
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, []);

  // 🔹 Update `currentAlbum` when `albums` change
  useEffect(() => {
    const foundAlbum = albums.find((album) => album?._id === albumId);
    setCurrentAlbum(foundAlbum);
  }, [albums, albumId]);

  const toggleImageModal = () => {
    setShow(!show);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleTagsChange = (e) => setTags(e.target.value);
  const handlePersonChange = (e) => setPerson(e.target.value);
  const handleFavoriteChange = (e) => setIsFavorite(e.target.checked);

  // 🔹 Handle image upload and refresh albums/images
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

  // 🔹 Show loading state if albums are not yet loaded
  if (albumStatus === "loading" || !albums.length)
    return <p>Loading album...</p>;
  if (imageStatus === "loading")
    return <p className="text-center">Loading images...</p>;
  if (imageStatus === "failed")
    return <p className="text-center text-danger">Error: {imageError}</p>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center py-2 mb-4">
        <div>
          <h2 className="text-center">📷 {currentAlbum?.name}</h2>
        </div>
        <div>
          <button className="btn sumitBtn" onClick={toggleImageModal}>
            Upload Image
          </button>
        </div>
      </div>
      <div className="row">
        {currentAlbum && currentAlbum.images?.length > 0 ? (
          currentAlbum.images.map((img) => (
            <div key={img._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <Link
                to={`/albums/${currentAlbum?._id}/images/${img?._id}`}
                className="image-link"
                // state={{ currentAlbum }}
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
