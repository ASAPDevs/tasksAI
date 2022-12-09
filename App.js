import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, Suspense } from "react";
import Menu from "./components/Menu";
import { Provider } from "react-redux";
import store from "./redux/store";
import { NativeBaseProvider, Box } from "native-base";
const LazyLoadLanding = React.lazy(() => import("./components/Landing"));
const LazyLoadDashboard = React.lazy(() => import("./components/Dashboard"));
const LazyLoadCalendar = React.lazy(() => import("./components/Calendar"));
const LazyLoadToday = React.lazy(() => import("./components/Today"));
const LazyLoadSettings = React.lazy(() => import("./components/Settings"));

export default function App() {
  const [currentView, updateCurrentView] = useState("dashboard");

  //Lazy load the view
  function conditionalRender() {
    if (currentView === "landing") return <LazyLoadLanding />;
    else if (currentView === "dashboard") return <LazyLoadDashboard />;
    else if (currentView === "calendar") return <LazyLoadCalendar />;
    else if (currentView === "today") return <LazyLoadToday />;
    else if (currentView === "settings") return <LazyLoadSettings />;
  }

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <View style={styles.container}>
          {/* Only show hamburger menu when user successfully logs in */}
          {currentView !== "landing" && (
            <Menu
              currentView={currentView}
              updateCurrentView={updateCurrentView}
            />
          )}
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
      </Provider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
});
