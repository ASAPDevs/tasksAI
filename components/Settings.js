import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { logoutUser } from "../redux/slices/storageSlice";
import { useDispatch } from "react-redux";

const LazyLoadAccountSettings = React.lazy(() =>
  import("./settings/AccountSettings")
);

const Settings = ({navigation}) => {
  const [currentView, updateCurrentView] = useState("main");
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("userid");
    try {
      await dispatch(logoutUser())
      navigation.navigate('LandingPage')
    } catch (err){
      console.log(err)
    }
  };

  const conditionalRender = () => {
    switch (currentView) {
      case "main":
        return (
          <View style={styles.innerContainer}>
            <Text
              style={styles.text}
              onPress={() => updateCurrentView("account")}
            >
              Account
            </Text>
            <Text style={styles.text}>Privacy (Unavailable Currently)</Text>
            <Text style={styles.text}>
              Notifications (Unavailable Currently)
            </Text>
            <Text style={styles.text} onPress={() => logoutHandler()}>
              Logout
            </Text>
          </View>
        );
      case "account":
        return (
          <LazyLoadAccountSettings navigation={navigation} updateCurrentView={updateCurrentView} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {conditionalRender()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    paddingTop: 30,
    paddingLeft: 20,
  },
  text: {
    fontSize: 22,
    margin: 10,
    fontFamily: "FamiljenGrotesk",
  },
});

export default Settings;
