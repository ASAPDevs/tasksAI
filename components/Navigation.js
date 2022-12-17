import Dashboard from "./Dashboard";
import Today from "./Today";
import Calendar from "./Calendar";
import Settings from "./Settings";
import {createDrawerNavigator} from '@react-navigation/drawer'

const DrawerNavigatorConfig = {
  intialRouteName: 'Dashboard',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      color: 'white',
    },
  },
  contentOptions: {
    // add your styling here 
    activeTintColor: '#FAA946',
    itemsContainerStyle: {
      marginVertical: 0,
    },
    iconContainerStyle: {
      opacity: 1,
    },
  },
  // drawerBackgroundColor: '#262A2C', // sets background color of drawer
};

const Drawer = createDrawerNavigator();


function Navigation() {
  return (
    <Drawer.Navigator
    initialRouteName="Dashboard" 
    screenOptions={{
      headerTintColor: "#FAA946",
      headerTitleStyle: {
        color: 'black'
      },
      drawerActiveTintColor: "#FAA946",
      drawerInactiveTintColor: "black",
    }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Today" component={Today} />
      <Drawer.Screen name="Calendar" component={Calendar} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}



export default Navigation;