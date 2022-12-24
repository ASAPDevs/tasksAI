import { useMutation } from '@apollo/client';
import { Heading, Icon, Pressable } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CHANGE_EMAIL } from '../helpers/mutations';
import { useSelector } from 'react-redux';
import { updateEmail } from '../../redux/slices/storageSlice';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

const initialUser = {
  newEmail: "",
  confirmNewEmail: ""
}

const ChangeEmailForm = ({updateCurrentAccountView}) => {
  const [focus, setFocus] = useState("");
  const [user, setUser] = useState(initialUser);
  const [wrongCredentials, toggleWrongCredentials] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const username = useSelector((state) => state.storage.username)
  const dispatch = useDispatch();

  



  const handleSubmit = () => {
    const userInput = {
      username: username,
      email: user.newEmail
    }
    changeEmail({ variables: { userInput } })
    
  }

  const [changeEmail] = useMutation(CHANGE_EMAIL, {
    onCompleted: (data) => {
      toggleWrongCredentials(false)
      setSuccessMessage("Success!")
      setUser(initialUser)
      dispatch(updateEmail({email: data.changeEmail.email}))
    },
    onError: (err) => {
      console.log("Error in change email mutation: ", err)
      toggleWrongCredentials(true)
      setSuccessMessage("")
    }
  })


  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        {/* Back Button */}
        <Pressable onPress={() => updateCurrentAccountView('main')}>
          <Icon as={Ionicons} name="arrow-back" color="black" size={6} marginLeft={1} />
        </Pressable>
        <Heading style={styles.heading}>Change Email</Heading>
        <TextInput
          autoCapitalize="none"
          style={focus === "new-email" ? styles.inputFocus : styles.input}
          secureTextEntry={false}
          placeholder="New Email Address"
          name="new-email"
          value={user.newEmail}
          onChangeText={text => setUser({ ...user, newEmail: text })}
          onFocus={() => setFocus("new-email")}
        />
        <TextInput
          autoCapitalize="none"
          style={focus === "confirm-email" ? styles.inputFocus : styles.input}
          secureTextEntry={false}
          placeholder="Confirm New Email Address"
          name="confirm-email"
          value={user.confirmNewEmail}
          onChangeText={text => setUser({ ...user, confirmNewEmail: text })}
          onFocus={() => setFocus("confirm-email")}
        />

        {focus == 'confirm-email' && user.confirmNewEmail.length > 0 && user.newEmail !== user.confirmNewEmail ? <Text style={{color: 'red', marginLeft: 7.5}}>Emails don't match!</Text> : null}

        <TouchableOpacity 
          disabled={!user.newEmail || !user.confirmNewEmail ? true : false} 
          style={{...styles.submitButton, backgroundColor: `${!user.newEmail || !user.confirmNewEmail ? 'grey' : '#007bff'}`}}
          onPress={handleSubmit} 
        >
          <Text style={styles.buttonText}>
            Change Email Address
          </Text>
        </TouchableOpacity>

        {wrongCredentials ? 
          <Text style={{color: 'red', left: 10 }}>
            Invalid Login Credentials.
          </Text> : null
        }
        {successMessage ? 
          <Text style={{color: 'green', left: 10 }}>
            {successMessage}
          </Text> : null
        }
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

export default ChangeEmailForm;