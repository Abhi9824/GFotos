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
    window.location.href = "http://localhost:4000/auth/google";
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
    <div>
      <div className="container">
        <div className="d-flex container justify-content-between align-items-center py-4">
          <h1>Welcome to GFotos</h1>
          <div className="d-flex m-2">
            {!isLoggedIn && (
              <button onClick={googleLogin}>
                <FcGoogle />
                <span> with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
