import { useMutation } from '@apollo/client';
import { Heading, Icon, Pressable, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { DELETE_ACCOUNT } from '../helpers/mutations';
import { logoutUser } from '../../redux/slices/storageSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";


const DeleteAccount = ({navigation, updateCurrentAccountView}) => {
  const userID = useSelector(state => state.storage.user_id);
  const dispatch = useDispatch();


  const [deleteAccount] = useMutation(DELETE_ACCOUNT, {
    onCompleted: async () => {
      await SecureStore.deleteItemAsync("username");
      await SecureStore.deleteItemAsync("userid");
      try {
        await dispatch(logoutUser())
        navigation.navigate('LandingPage')
      }
      catch(err) {
        console.log("Error in deletion:", err)
      }
    },
    onError: (err) => {
      console.log("Error in delete account mutation: ", err)
    }
  })

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        {/* Back Button */}
        <Pressable onPress={() => updateCurrentAccountView('main')}>
          <Icon as={Ionicons} name="arrow-back" color="black" size={6} marginLeft={1} />
        </Pressable>
        <Heading style={styles.heading}>Are you sure?</Heading>
        <Text style={styles.heading}>Deleting your account is irreversible, and all your data will be lost with it.{"\n"}Press delete below if you are sure you want to go through with deletion.</Text>
        <Button 
        onPress={() => deleteAccount({variables: {deleteUserId: userID}})}
        variant="solid" width={100} marginLeft={2} bgColor="red.400" >
          Delete
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    zIndex: -1
  },
  innerContainer: {
    paddingTop: 30,
    paddingLeft: 20,
  },
  heading: {
    alignItems: "center",
    margin: 8,
    fontFamily: 'FamiljenGrotesk',
  },
  input: {
    height: 40,
    width: "90%",
    margin: 8,
    fontFamily: 'FamiljenGrotesk',
    borderWidth: 1,
    borderRadius: 7,
    padding: 10
  },
  inputFocus: {
    height: 40,
    width: "90%",
    margin: 8,
    fontFamily: 'FamiljenGrotesk',
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    borderColor: "#007bff"
  },
  submitButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "90%",
    margin: 8,
    marginTop: 15,
    borderWidth: 1,
    fontFamily: 'FamiljenGrotesk',
    borderRadius: 7,
  },
  buttonText: {
    fontFamily: 'FamiljenGrotesk',
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17
  },
})

export default DeleteAccount;