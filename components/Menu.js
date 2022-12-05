import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useEffect} from "react";
import { Slide, Text, Button, Icon, Pressable} from "native-base";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

export default function Menu({currentView, updateCurrentView}) {
  const [menu, openMenu] = useState(false);
  const [fontsLoaded, updateFonts] = useState(false);

  //FOR IMPORTING FONTS ASYNC
  async function loadFonts() {
    await Font.loadAsync({
      'Sofia': require('../assets/fonts/sofiapro-light.ttf')
    })
    updateFonts(true);
  }

  //Loads Font On FIRST/Initial Mount
  useEffect(() => {
    loadFonts();
  }, [])
  //Whenever currentView updates, we will close the menu with this useEffect
  useEffect(() => {
    openMenu(false)
  }, [currentView])

  const MenuComponent = () => {
    return (
      <View style={styles.menuComponent}>
        <View style={styles.menuItemsContainer} >
          <Button variant="ghost" isPressed={currentView == 'dashboard' ? true : false} justifyContent={"flex-start"} borderRadius={0} onPress={() => updateCurrentView('dashboard')} colorScheme="white"><Text style={styles.menuItemButtonText}>Dashboard</Text></Button>
          <Button variant="ghost" isPressed={currentView == 'calendar' ? true : false} justifyContent={"flex-start"}  onPress={() => updateCurrentView('calendar')} colorScheme="white"><Text style={styles.menuItemButtonText}>Calendar</Text></Button>
          <Button justifyContent={"flex-start"} isPressed={currentView == 'today' ? true : false} variant="ghost" onPress={() => updateCurrentView('today')} colorScheme="white"><Text style={styles.menuItemButtonText}>Daily Tasks</Text></Button>
          <Button justifyContent={"flex-start"} isPressed={currentView == 'settings' ? true : false} variant="ghost" onPress={() => updateCurrentView('settings')} colorScheme="white"><Text style={styles.menuItemButtonText}>Settings</Text></Button>
        </View>
        <View onPress={() => openMenu(false)} style={styles.closeMenuButtonContainer}>
          <Pressable onPress={() => openMenu(false)}>
            <Icon as={MaterialCommunityIcons} name="arrow-collapse-left" color="darkgrey" size={"8"}/>
          </Pressable>
        </View>
      </View>
    );
  };

  if (fontsLoaded) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuButton} onPress={() => openMenu(!menu)}>
          <Icon as={Ionicons} size={8} name="ios-menu" color="black" />
        </TouchableOpacity>
        <Slide duration={150} in={menu} out={menu} placement="left">
          <MenuComponent />
        </Slide>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    elevation: 50,
    shadowColor: '#FFFFFF',
  },
  menuComponent: {
    backgroundColor: "#f5efdf",
    width: 300,
    display: 'flex',
    position: 'relative',
    top: 65,
    right: 10,
    paddingTop: 0,
    borderColor: 'grey',
    borderWidth: 1,
    flexDirection: 'column',
    height: 800,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 80,
    right: 150,
  },
  menuItemsContainer: {
    padding: 0,
    height: '30%',
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
  },
  menuItemButton: {
    backgroundColor: 'white'
  },
  menuItemButtonContainer: {
    display: 'flex',
    justifyContent: 'start',
  },
  menuButtonIcon: {
    fontSize: 30,
    zIndex: 10
  },
  closeMenuButton: {
    position: 'relative',
    left: "90%"
  },
  menuItemButtonText: {
    fontFamily: 'Sofia',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeMenuButtonContainer: {
    borderColor: 'grey',
    height: 80,
    borderRadius: 2,
    width: 30,
    overflow: 'hidden',
    left: 269,
    paddingRight: 5,
    top: 30,
    borderWidth: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
});
