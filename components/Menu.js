import {
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { Slide, Text, Button, Icon, Pressable } from "native-base";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/storageSlice";

const Menu = ({ currentView, updateCurrentView }) => {
  const [menu, openMenu] = useState(false);

  const dispatch = useDispatch();


  //Whenever currentView updates, we will close the menu with this useEffect
  useEffect(() => {
    openMenu(false);
  }, [currentView]);

  const handleLogout = () => {
    dispatch(logoutUser())
    updateCurrentView('landing')
  }

  const MenuComponent = () => {
    return (
      <View style={styles.menuComponent}>
        <View style={styles.menuItemsContainer}>
          <Button
            variant="ghost"
            isPressed={currentView == "dashboard" ? true : false}
            justifyContent={"flex-start"}
            borderRadius={0}
            onPress={() => updateCurrentView("dashboard")}
            colorScheme="white"
          >
            <Text style={styles.menuItemButtonText}>Dashboard</Text>
          </Button>
          <Button
            variant="ghost"
            isPressed={currentView == "calendar" ? true : false}
            justifyContent={"flex-start"}
            onPress={() => updateCurrentView("calendar")}
            colorScheme="white"
          >
            <Text style={styles.menuItemButtonText}>Calendar</Text>
          </Button>
          <Button
            justifyContent={"flex-start"}
            isPressed={currentView == "today" ? true : false}
            variant="ghost"
            onPress={() => updateCurrentView("today")}
            colorScheme="white"
          >
            <Text style={styles.menuItemButtonText}>Daily Tasks</Text>
          </Button>
          <Button
            justifyContent={"flex-start"}
            isPressed={currentView == "settings" ? true : false}
            variant="ghost"
            onPress={() => updateCurrentView("settings")}
            colorScheme="white"
          >
            <Text style={styles.menuItemButtonText}>Settings</Text>
          </Button>
          <Button
            justifyContent={"flex-start"}
            variant="ghost"
            onPress={handleLogout}
            colorScheme="white"
          >
            <Text style={styles.menuItemButtonText}>Log out</Text>
          </Button>
        </View>
        <View
          onPress={() => openMenu(false)}
          style={styles.closeMenuButtonContainer}
        >
          <Pressable onPress={() => openMenu(false)}>
            <Icon
              as={MaterialCommunityIcons}
              name="arrow-collapse-left"
              color="darkgrey"
              size={"8"}
            />
          </Pressable>
        </View>
      </View>
    );
  };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => openMenu(!menu)}
        >
          <Icon as={Ionicons} size={8} name="ios-menu" color="black" />
        </TouchableOpacity>
        <Slide duration={150} in={menu} out={menu} placement="left">
          <MenuComponent />
        </Slide>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    elevation: 50,
    shadowColor: "#FFFFFF",
  },
  menuComponent: {
    backgroundColor: "#f5efdf",
    width: 300,
    display: "flex",
    position: "relative",
    top: 65,
    right: 10,
    paddingTop: 0,
    borderColor: "grey",
    borderWidth: 1,
    flexDirection: "column",
    height: 800,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  menuButton: {
    position: "absolute",
    top: 80,
    right: 150,
  },
  menuItemsContainer: {
    padding: 0,
    height: "30%",
    justifyContent: "space-evenly",
    display: "flex",
    flexDirection: "column",
  },
  menuItemButton: {
    backgroundColor: "white",
  },
  menuItemButtonContainer: {
    display: "flex",
    justifyContent: "start",
  },
  menuButtonIcon: {
    fontSize: 30,
    zIndex: 10,
  },
  closeMenuButton: {
    position: "relative",
    left: "90%",
  },
  menuItemButtonText: {
    fontFamily: "Sofia",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeMenuButtonContainer: {
    borderColor: "grey",
    height: 80,
    borderRadius: 2,
    width: 30,
    overflow: "hidden",
    left: 269,
    paddingRight: 5,
    top: 30,
    borderWidth: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default Menu;