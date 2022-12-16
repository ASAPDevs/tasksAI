import React from 'react'
import { SafeAreaView, StyleSheet, View, Text } from 'react-native'

const Settings = ({ updateCurrentView }) => {
  
  return (
    <SafeAreaView style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <Text 
            style={styles.text}
            onPress={() => updateCurrentView('change-password')}
          >
            Change Password
          </Text>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1
  },
  innerContainer: {
    paddingTop: 80,
    paddingLeft: 20,
  },
  text: {
    fontSize: 20,
    margin: 10
  }
})

export default Settings