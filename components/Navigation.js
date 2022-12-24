import Dashboard from "./Dashboard";
import Today from "./Today";
import React, {useState, useEffect} from 'react';
import Settings from "./Settings";
import LandingPage from "./Landing";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Splash from "./Splash";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from 'expo-secure-store';
import { loginUser } from "../redux/slices/storageSlice";

const Navigation = () => {
  const isLoggedIn = useSelector((state) => state.storage.loggedIn, shallowEqual);
  const [isLoading, updateLoading] = useState(true);

  const dispatch = useDispatch();
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  const sessionHandler = async () => {
    let username = await SecureStore.getItemAsync("username");
    let user_id = await SecureStore.getItemAsync("userid");
    let email = await SecureStore.getItemAsync("email");
    if (username && user_id) {
      dispatch(
        loginUser({
          username: username,
          user_id: Number(user_id),
          email: email
        })
      );
      updateLoading(false)
    } else {
      updateLoading(false);
    }
  };

  function Root() {
    return (
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerTintColor: "#FAA946",
          headerTitleStyle: {
            color: "black",
          },
          drawerActiveTintColor: "#FAA946",
          drawerInactiveTintColor: "black",
        }}
      >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Today" component={Today} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
    )
  }

  useEffect(() => {
    sessionHandler();
  }, [])

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={isLoading ? "Loading" : isLoggedIn ? "Root" : "Landing"}>
        {/* Order of the stacks matters!!! initialRouteName={isLoggedIn ? 'Root' : 'LandingPage'}*/}
        {isLoading && <Stack.Screen name="Loading" component={Splash} options={{ headerShown: false }} />}
        {!isLoggedIn && <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />}
        {isLoggedIn && <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />} 
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default Navigation;
