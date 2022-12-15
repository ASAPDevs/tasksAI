import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, Suspense } from "react";
import Menu from "./components/Menu";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import store from "./redux/store";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { NativeBaseProvider, Box } from "native-base";
const LazyLoadLanding = React.lazy(() => import("./components/Landing"));
const LazyLoadDashboard = React.lazy(() => import("./components/Dashboard"));
const LazyLoadCalendar = React.lazy(() => import("./components/Calendar"));
const LazyLoadToday = React.lazy(() => import("./components/Today"));
const LazyLoadSettings = React.lazy(() => import("./components/Settings"));

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
  // credentials: 'same-origin',
});




export default function App() {
  const [currentView, updateCurrentView] = useState("landing");
  const [fontsLoaded, updateFontsLoaded] = useState(false);
  //Lazy load the view
  function conditionalRender() {
    if (currentView === "landing") return <LazyLoadLanding updateCurrentView={updateCurrentView} />;
    else if (currentView === "dashboard") return <LazyLoadDashboard />;
    else if (currentView === "calendar") return <LazyLoadCalendar />;
    else if (currentView === "today") return <LazyLoadToday />;
    else if (currentView === "settings") return <LazyLoadSettings />;
  }

  async function loadFonts() {
    await Font.loadAsync({
      Sofia: require("./assets/fonts/sofiapro-light.ttf"),
      FamiljenGrotesk: require('./assets/fonts/FamiljenGrotesk-Regular.ttf'),
      FamiljenBold: require('./assets/fonts/FamiljenGrotesk-SemiBold.ttf')
    });
    updateFontsLoaded(true)
  }
  
  //load fonts
  useEffect(() => {
    loadFonts()
  }, [])

  if (fontsLoaded) {
    return (
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    );
  }
  else return null;
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
