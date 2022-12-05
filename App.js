import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, Suspense } from "react";
import Menu from "./components/Menu";
const LazyLoadLanding = React.lazy(() => import("./components/Landing"));
const LazyLoadDashboard = React.lazy(() => import("./components/Dashboard"));

export default function App() {
  const [currentView, updateCurrentView] = useState("landing");

  //Lazy load the view
  function conditionalRender() {
    if (currentView === "landing") return <LazyLoadLanding />;
    else if (currentView === "dashboard") return <LazyLoadDashboard />;
  }

  // useEffect(() => {
  //   updateCurrentView(currentView)
  // }, [currentView])

  return (
      <View style={styles.container}>
        <Menu />
        <Suspense
          fallback={
            <View>
              <Text>Loading..</Text>
            </View>
          }
        >
          {conditionalRender()}
        </Suspense>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
