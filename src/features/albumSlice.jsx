import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/baseUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = `${BASE_URL}/albums`;

export const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token is missing, authentication error");
    }
    const response = await axios.get(api, {
      headers: { Authorization: token },
    });

    if (response) {
      return response.data.album;
    }
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch albums");
  }
});

export const createAlbum = createAsyncThunk(
  "albums/createAlbum",
  async (albumData) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.post(api, albumData, {
        headers: { Authorization: token },
      });
      return response.data.album;
    } catch (error) {
      throw new Error(error.response?.data || "Failed to create album");
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "albums/deleteAlbum",
  async (albumId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      await axios.delete(`${api}/${albumId}`, {
        headers: { Authorization: token },
      });
      return albumId;
    } catch (error) {
      throw new Error(error.response?.data || "Failed to delete album");
    }
  }
);
export const updateAlbumAsync = createAsyncThunk(
  "albums/updateAlbum",
  async ({ albumId, albumData }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.put(`${api}/${albumId}`, albumData, {
        headers: { Authorization: token },
      });
      return response.data.album;
    } catch (error) {
      throw new Error(error.response?.data || "Failed to update album");
    }
  }
);

const albumsSlice = createSlice({
  name: "album",
  initialState: {
    albums: [],
    albumStatus: "idle",
    albumError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.albumStatus = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albumStatus = "success";
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.albumStatus = "failed";
        state.albumError = action.error.message;
      })
      .addCase(createAlbum.pending, (state) => {
        state.albumStatus = "loading";
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.albumStatus = "success";
        state.albums = [...state.albums, action.payload];
        toast.success("Album created successfully!");
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.albumStatus = "failed";
        state.albumError = action.error.message;
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.albumStatus = "loading";
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.albums = state.albums.filter(
          (album) => album._id !== action.payload
        );
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.albumStatus = "failed";
        state.albumError = action.error.message;
      })
      .addCase(updateAlbumAsync.pending, (state) => {
        state.albumStatus = "loading";
      })
      .addCase(updateAlbumAsync.fulfilled, (state, action) => {
        const index = state.albums.findIndex(
          (album) => album._id === action.payload._id
        );
        if (index !== -1) {
          state.albums[index] = action.payload;
        }
        toast.success("Album updated successfully!");
      })
      .addCase(updateAlbumAsync.rejected, (state, action) => {
        state.albumStatus = "failed";
        state.albumError = action.error.message;
      });
  },
});

export default albumsSlice.reducer;
