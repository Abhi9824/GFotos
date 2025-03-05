import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import { fetchProfile } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  const googleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_BASE_URL
    }/auth/google`;
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      dispatch(fetchProfile())
        .unwrap()
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.error("Profile fetch error:", error);
        });
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");

    if (urlToken) {
      localStorage.setItem("access_token", urlToken);
      dispatch(fetchProfile())
        .unwrap()
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.error("Profile fetch error:", error);
        });
    }
  }, [dispatch, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div>
          {" "}
          <h1>Welcome to GFotos</h1>
          <h3>Saved Memories with Us!</h3>
        </div>

        {!isLoggedIn && (
          <button className="google-login-btn" onClick={googleLogin}>
            <FcGoogle className="google-icon" />
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
