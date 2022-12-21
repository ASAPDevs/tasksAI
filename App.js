import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import * as Font from "expo-font";
import LandingPage from "./components/Landing";
import store from "./redux/store";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { NativeBaseProvider } from "native-base";

const client = new ApolloClient({
  // uri: 'https://ai-todo-server-production.up.railway.app/graphql',
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
