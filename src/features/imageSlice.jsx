import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../utils/baseUrl";
import { BASE_URL } from "../utils/baseUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = `${BASE_URL}/images`;

export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (albumId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.get(`${api}/albums/${albumId}/images`, {
        headers: { Authorization: token },
      });
      if (response) {
        return response.data.images;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch the images"
      );
    }
  }
);

export const addImage = createAsyncThunk(
  "images/addImage",
  async ({ albumId, formData }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }

      const response = await axios.post(`${api}/${albumId}/upload`, formData, {
        headers: { Authorization: token },
        "Content-Type": "multipart/form-data",
      });
      if (response) {
        const { data } = response;
        return data.image;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload the image"
      );
    }
  }
);
export const updateImage = createAsyncThunk(
  "images/updateImage",
  async ({ imageId, updatedData }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      // Convert tags to an array if it's a string
      if (updatedData.tags && typeof updatedData.tags === "string") {
        updatedData.tags = updatedData.tags.split(",").map((tag) => tag.trim());
      }

      const response = await axios.put(
        `${api}/${imageId}/update`,
        updatedData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        return response.data.image;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update the image"
      );
    }
  }
);

export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async ({ imageId, albumId }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.delete(`${api}/${albumId}/${imageId}`, {
        headers: { Authorization: token },
      });
      if (response.status.ok) {
        const data = response.data;
        return data;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete the image"
      );
    }
  }
);

export const getImageDetails = createAsyncThunk(
  "images/getImageDetails",
  async ({ imageId, albumId }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.get(
        `${api}/albums/${albumId}/${imageId}/images`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.status.ok) {
        const data = response.data;
        return data.image;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete the image"
      );
    }
  }
);

export const addCommentToImageAsync = createAsyncThunk(
  "images/addComment",
  async ({ imageId, albumId, comment }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }

      const response = await axios.post(
        `${api}/${albumId}/${imageId}/comment`,
        { comments: comment },
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add comment");
    }
  }
);

export const fetchFavoriteImages = createAsyncThunk(
  "images/fetchFavoriteImages",
  async ({ albumId, imageId }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.put(
        `${api}/${albumId}/${imageId}/favorite`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      return response.data.image;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update favorite status"
      );
    }
  }
);

const imagesSlice = createSlice({
  name: "image",
  initialState: {
    images: [],
    imageStatus: "idle",
    imageError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.imageStatus = "success";
        state.images = action.payload;
      })

      .addCase(fetchImages.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      })
      .addCase(addImage.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.imageStatus = "success";
        // state.images = [...state.images, action.payload];
        state.images.push(action.payload);
        toast.success("Added Image");
      })
      .addCase(addImage.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      })
      .addCase(deleteImage.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.imageStatus = "success";
        state.images = state.images.filter(
          (image) => image._id !== action.payload
        );
        toast.success("Image deleted successfully");
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      })
      .addCase(getImageDetails.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(getImageDetails.fulfilled, (state, action) => {
        state.imageStatus = "success";
        state.images = action.payload;
      })
      .addCase(getImageDetails.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      })

      .addCase(fetchFavoriteImages.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(fetchFavoriteImages.fulfilled, (state, action) => {
        const updatedImage = action.payload;
        const index = state.images.findIndex(
          (img) => img._id === updatedImage._id
        );
        if (index !== -1) {
          state.images[index] = updatedImage; // Update the correct image in the store
        }
      })
      .addCase(fetchFavoriteImages.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      })
      .addCase(addCommentToImageAsync.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(addCommentToImageAsync.fulfilled, (state, action) => {
        const updatedImage = action.payload;
        const imageIndex = state.images.findIndex(
          (image) => image._id === updatedImage._id
        );

        if (imageIndex !== -1) {
          state.images[imageIndex] = updatedImage;
        }
        state.imageStatus = "success";
        toast.success("Comment added successfully!");
      })
      .addCase(addCommentToImageAsync.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      })
      .addCase(updateImage.pending, (state) => {
        state.imageStatus = "loading";
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const updatedImage = action.payload;
        const imageIndex = state.images.findIndex(
          (img) => img?._id === updatedImage?._id
        );
        if (imageIndex !== -1) {
          state.images[imageIndex] = updatedImage;
        }
        state.imageStatus = "success";
        toast.success("Image Details Updated");
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.imageStatus = "failed";
        state.imageError = action.error.message;
      });
  },
});

export default imagesSlice.reducer;
