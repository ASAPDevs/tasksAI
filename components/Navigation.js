import Dashboard from "./Dashboard";
import Today from "./Today";
import Calendar from "./Calendar";
import Settings from "./Settings";
import {createDrawerNavigator} from '@react-navigation/drawer'


const Drawer = createDrawerNavigator();


function Navigation() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Today" component={Today} />
      <Drawer.Screen name="Calendar" component={Calendar} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}



export default Navigation;