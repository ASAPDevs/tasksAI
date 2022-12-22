import Dashboard from "./Dashboard";
import Today from "./Today";
import Calendar from "./Calendar";
import { Text } from "native-base";
import React, {useState, useEffect} from 'react';
import Settings from "./Settings";
import LandingPage from "./Landing";
import { useSelector, useDispatch } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from 'expo-secure-store';
import { loginUser } from "../redux/slices/storageSlice";

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


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// export const navigationRef = createNavigationContainerRef();
// export function navigate(name, params) {
//   if (navigationRef.isReady()) {
//     navigationRef.navigate(name, params);
//   }
// }

function Navigation() {
  const isLoggedIn = useSelector((state) => state.storage.loggedIn);
  console.log("Logged in status in navigation: ", isLoggedIn)
  const dispatch = useDispatch();

  // const sessionHandler = async () => {
  //   let username = await SecureStore.getItemAsync("username");
  //   let user_id = await SecureStore.getItemAsync("userid");
  //   console.log("loggedin state:", username, user_id);
  //   if (username && user_id) {
  //     dispatch(
  //       loginUser({
  //         username: username,
  //         user_id: Number(user_id),
  //       })
  //     );
  //   }
  // };

  // useBeforeRender(() => sessionHandler(), [])
  
  function Root() {
    return (
      <Drawer.Navigator
     
      // ref={navigationRef}
      // independent={true}
      // initialRouteName="Dashboard"
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
      {/* <Drawer.Screen name="Calendar" component={Calendar} /> */}
      <Drawer.Screen name="Settings" component={Settings} />
      {/* <Drawer.Item label="Logout" onPress={() => console.log('logout')} /> */}
      
    </Drawer.Navigator>
    )
  }

  
  
  // useEffect(() => {
  // }, [isLoggedIn])

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator >
        {isLoggedIn ? 
          <Stack.Screen 
            name="Root" 
            component={Root} />
            :
          <Stack.Screen 
            name="LandingPage" 
            component={LandingPage} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// function LandingNavigator() {
//   return (
//     <Stack.Navigator
//     // independent={true}
//     // initialRouteName="Dashboard"
//     screenOptions={{
//       headerTintColor: "#FAA946",
//       headerTitleStyle: {
//         color: "black",
//       },
//       drawerActiveTintColor: "#FAA946",
//       drawerInactiveTintColor: "black",
//     }}
//   >
//     <Stack.Screen name="Landing" component={LandingPage} />
//   </Stack.Navigator>
//   )
// }

export default Navigation;
