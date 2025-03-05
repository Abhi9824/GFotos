export const BASE_URL = "https://gfotos-backend.onrender.com";


export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token is missing, authentication error");
  }
  return { Authorization: token };
};
