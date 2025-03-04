export const BASE_URL = "http://localhost:4000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token is missing, authentication error");
  }
  return { Authorization: token }; // No need for 'Bearer' if fetchAlbums works without it
};
