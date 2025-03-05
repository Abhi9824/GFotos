import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/baseUrl";

// Fetch User Profile After Google Login
export const fetchProfile = createAsyncThunk("user/fetchProfile", async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token is missing, authentication error");
    }
    const response = await axios.get(`${BASE_URL}/auth/user/profile/google`, {
      headers: { Authorization: token },
    });

    const data = response.data;
    if (data?.token) {
      localStorage.setItem("access_token", data.token);
    }

    return { user: data.user, token };
  } catch (error) {
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("access_token");
    // }
    console.error("Error fetching profile:", error);
    throw error.response?.data || "Unknown error";
  }
});

// Logout (Clears Local Storage)
export const logoutUser = createAsyncThunk("user/logout", async () => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`);
    localStorage.removeItem("access_token");
    return null;
  } catch (error) {
    throw error.response?.data || "Logout failed";
  }
});

export const getAllUsers = createAsyncThunk("users/fetchAllusers", async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    if (response) {
      console.log("users", response.data.users);
      return response.data.users;
    }
  } catch (error) {
    throw new Error("Failed to fetch the users");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("access_token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoggedIn: !!localStorage.getItem("access_token"),
    status: "idle",
    error: null,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.status = "success";
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
        state.isLoggedIn = false;
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
        state.status = "idle";
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
