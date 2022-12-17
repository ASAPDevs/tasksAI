import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, Suspense } from "react";
import Menu from "./components/Menu";
import { Provider } from "react-redux";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from "expo-font";
import LandingPage from "./components/Landing";
import store from "./redux/store";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { NativeBaseProvider, Box } from "native-base";
import { useSelector } from "react-redux";
const LazyLoadLanding = React.lazy(() => import("./components/Landing"));
const LazyLoadDashboard = React.lazy(() => import("./components/Dashboard"));
const LazyLoadCalendar = React.lazy(() => import("./components/Calendar"));
const LazyLoadToday = React.lazy(() => import("./components/Today"));
const LazyLoadSettings = React.lazy(() => import("./components/Settings"));
const LazyChangePasswordForm = React.lazy(() => import("./components/ChangePasswordForm"));

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
  const [fontsLoaded, updateFontsLoaded] = useState(false);


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
            <NavigationContainer>
              <LandingPage />
            </NavigationContainer>
          </Provider>
        </NativeBaseProvider>
      </ApolloProvider>
    );
  }
  else return null;
}
