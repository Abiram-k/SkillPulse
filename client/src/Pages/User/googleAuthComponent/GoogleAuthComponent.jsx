import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../redux/userSlice";
function GoogleAuthComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(addUser({ isLoggedIn: true }));
    navigate("/user/home");
  }, [navigate]);
}

export default GoogleAuthComponent;
