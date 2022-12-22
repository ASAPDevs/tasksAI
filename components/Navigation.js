import Dashboard from "./Dashboard";
import Today from "./Today";
import Calendar from "./Calendar";
import { Text } from "native-base";
import React, {useState, useEffect} from 'react';
import Settings from "./Settings";
import LandingPage from "./Landing";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Splash from "./Splash";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from 'expo-secure-store';
import { loginUser } from "../redux/slices/storageSlice";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DrawerNavigatorConfig = {
  intialRouteName: "Dashboard",
  navigationOptions: {
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      color: "white",
    },
  },
  contentOptions: {
    // add your styling here
    activeTintColor: "#FAA946",
    itemsContainerStyle: {
      marginVertical: 0,
    },
    iconContainerStyle: {
      opacity: 1,
    },
  },
  // drawerBackgroundColor: '#262A2C', // sets background color of drawer
};

const useBeforeRender = (callback, deps) => {
  const [isRun, setIsRun] = useState(false);

  if (!isRun) {
    callback();
    setIsRun(true);
  }

  useEffect(() => () => setIsRun(false), deps);
};




// export const navigationRef = createNavigationContainerRef();
// export function navigate(name, params) {
//   if (navigationRef.isReady()) {
//     navigationRef.navigate(name, params);
//   }
// }

function Navigation() {
  const isLoggedIn = useSelector((state) => state.storage.loggedIn, shallowEqual);
  const [isLoading, updateLoading] = useState(true);
  console.log("Logged in status in navigation: ", isLoggedIn)
  const dispatch = useDispatch();
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

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

  // let view;
  // useEffect(() => {
  //   if (isLoading) {
  //     view = "Loading"
  //   } else {
  //     if (isLoggedIn) {
  //       view = "Root"
  //     } else {
  //       view = "LandingPage"
  //     }
  //   }
  // }, [isLoading, isLoggedIn])



  // useEffect(() => {
  //   // Update the initial route of the Stack navigator when the isLoggedIn state changes
  //   Stack.Navigator.initialRouteName = !isLoggedIn ? "LandingPage" : "Root";
  //   console.log("checking route: ", Stack.Navigator.initialRouteName)
  // }, [isLoggedIn]);


  return (
    <NavigationContainer independent={true}>
      {/* <Stack.Navigator  initialRouteName={view}> */}
      {/* <Stack.Navigator  initialRouteName={isLoading ? "Loading" : isLoggedIn ? "Root" : "LandingPage"}> */}
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
