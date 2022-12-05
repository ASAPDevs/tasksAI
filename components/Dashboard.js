import { StyleSheet } from "react-native";
import { View, Text, Heading, Center } from "native-base";
import { useEffect, useState } from "react";
import {updateUsername} from '../redux/slices/storageSlice'
import { useSelector } from "react-redux";



const Dashboard = () => {
  // const [username, setUsername] = useState('Jackie')
  const username = useSelector((state) => state.storage.username)


  useEffect(() => {
    console.log("Checking username in dashboard: ", username)
  }, [])

  return (
    <View style={styles.container}><Heading>Welcome Back, {username}</Heading></View>
      
  )
}







const styles = StyleSheet.create({
  container: {
    display: 'flex',
    borderColor: 'yellow',
    borderWidth: 2,
    top: 100,
    width: "100%",
    height: '50%',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute'
  }



})









export default Dashboard