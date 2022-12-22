import { StyleSheet } from "react-native";
import { View, Text, Heading, Center, Switch } from "native-base";
import { useEffect, useState } from "react";
import { updateUsername } from "../redux/slices/storageSlice";
import { useSelector } from "react-redux";
import Emoji from "./helpers/Emoji";
import * as Font from "expo-font";

const Dashboard = () => {
  const username = useSelector((state) => state.storage.username);


  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <Heading style={styles.heading}>
          Hello, {<Heading style={styles.username}>{username}.</Heading>}{" "}
          <Emoji symbol={0x1f44b} />
        </Heading>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    borderColor: "yellow",
    borderWidth: 2,
    top: 100,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "20%",
    borderColor: "red",
    borderWidth: 2,
  },
  heading: {
    textAlign: "center",
    fontFamily: "FamiljenGrotesk",
    padding: 10,
    fontSize: 35,
    width: "100%",
    lineHeight: 50,
    letterSpacing: 0,
  },
  username: {
    fontFamily: "FamiljenGrotesk",
    padding: 10,
    flexWrap: "wrap",
    fontSize: 35,
    height: 25,
    width: "100%",
    lineHeight: 50,
    letterSpacing: 0,
    color: "#DBA989",
  },
});

export default Dashboard;
