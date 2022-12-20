import React, {useState} from 'react'
import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import Account from './settings/AccountSettings'
const LazyLoadAccountSettings = React.lazy(() => import('./settings/AccountSettings'))



const Settings = () => {
  const [currentView, updateCurrentView] = useState('main')


  const conditionalRender = () => {
    switch (currentView) {
      case 'main':
        return (
          <View style={styles.innerContainer}>
            <Text 
              style={styles.text}
              onPress={() => updateCurrentView('account')}
            >
              Account
            </Text>
            <Text 
              style={styles.text}
              
            >
              Privacy (Unavailable Currently)
            </Text>
            <Text 
              style={styles.text}
              
            >
              Notifications (Unavailable Currently)
            </Text>
        </View>
        )
     case 'account':
      return <LazyLoadAccountSettings updateCurrentView={updateCurrentView} />
  }}

  return (
    <SafeAreaView style={styles.mainContainer}>
        {conditionalRender()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    paddingTop: 30,
    paddingLeft: 20
  },
  text: {
    fontSize: 22,
    margin: 10,
    fontFamily: 'FamiljenGrotesk'
  }
})

export default Settings