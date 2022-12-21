import Dashboard from "./Dashboard";
import Today from "./Today";
import Calendar from "./Calendar";
import Settings from "./Settings";
import LandingPage from "./Landing";
import { useSelector, useDispatch } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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

export const navigationRef = createNavigationContainerRef();

function Navigation() {
  const isLoggedIn = useSelector((state) => state.storage.loggedIn);

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

  sessionHandler()

  session

  return (
    <NavigationContainer>
      {isLoggedIn ? (
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
          {/* <Drawer.Screen name="Calendar" component={Calendar} /> */}
          <Drawer.Screen name="Settings" component={Settings} />
          {/* <Drawer.Item label="Logout" onPress={() => console.log('logout')} /> */}
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            // initialParams={{ setLoggedIn }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Navigation;
