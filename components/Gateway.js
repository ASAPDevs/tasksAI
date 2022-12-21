import * as SecureStore from "expo-secure-store";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator } from "react-native";
import LandingPage from "./Landing";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { loginUser } from "../redux/slices/storageSlice";



const Gateway = () => {
  const loggedIn = useSelector((state) => state.storage.loggedIn);
  const dispatch = useDispatch();

  const sessionHandler = async () => {
    let username = await SecureStore.getItemAsync("username");
    let user_id = await SecureStore.getItemAsync("userid");
    console.log("loggedin state:", username, user_id);
    if (username && user_id) {
      dispatch(
        loginUser({
          username: username,
          user_id: Number(user_id),
        })
      );
    }
  };

  useBeforeRender(() => sessionHandler(), []);

  if (!loggedIn) {
    return <LandingPage />;
  } else {
    return <Navigation />;
  }
};

export default Gateway;
