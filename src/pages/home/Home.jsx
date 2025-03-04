import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/userSlice";
import Album from "../album/Album";

const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className="container py-4">
      <Album />
    </div>
  );
};

export default Home;
