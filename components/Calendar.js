import { Text, View} from 'native-base'
import {StyleSheet} from 'react-native'
import React from 'react'

function Calendar() {
  return (
    <View style={styles.container}>
      <Text>Hi</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    position: 'absolute',
    justifyContent: "center",
  },
  input: {
    border: '1px solid black'
  }
});


export default Calendar