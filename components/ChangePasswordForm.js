import { useMutation } from '@apollo/client';
import { Heading } from 'native-base';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CHANGE_PASSWORD } from './helpers/mutations';

const initialUser = {
  username: "",
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: ""
}

const ChangePasswordForm = () => {
  const [focus, setFocus] = useState("");
  const [user, setUser] = useState(initialUser);
  const [wrongCredentials, toggleWrongCredentials] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleSubmit = () => {
    const userInput = {
      username: user.username,
      oldPassword: user.oldPassword,
      newPassword: user.newPassword
    }
    changePassword({ variables: { userInput } })
  }

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      toggleWrongCredentials(false)
      setSuccessMessage("Success!")
      setUser(initialUser)
    },
    onError: (err) => {
      console.log("Error in change password mutation: ", err)
      toggleWrongCredentials(true)
      setSuccessMessage("")
    }
  })

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Heading style={styles.heading}>Change Password</Heading>
        <TextInput 
            autoFocus={true}
            autoCapitalize="none"
            style={focus === "username" ? styles.inputFocus : styles.input}
            placeholder="Username"
            id="username"
            value={user.username}
            onChangeText={text => setUser({ ...user, username: text })}
            onFocus={() => setFocus("username")}
        />
        <TextInput
          autoCapitalize="none"
          style={focus === "old-password" ? styles.inputFocus : styles.input}
          secureTextEntry={true}
          placeholder="Old Password"
          name="old-password"
          value={user.oldPassword}
          onChangeText={text => setUser({ ...user, oldPassword: text })}
          onFocus={() => setFocus("old-password")}
        />
        <TextInput
          autoCapitalize="none"
          style={focus === "new-password" ? styles.inputFocus : styles.input}
          secureTextEntry={true}
          placeholder="New password"
          name="new-password"
          value={user.newPassword}
          onChangeText={text => setUser({ ...user, newPassword: text })}
          onFocus={() => setFocus("new-password")}
        />
        <TextInput
          autoCapitalize="none"
          style={focus === "confirm-password" ? styles.inputFocus : styles.input}
          secureTextEntry={true}
          placeholder="Confirm new password"
          name="confirm-password"
          value={user.confirmNewPassword}
          onChangeText={text => setUser({ ...user, confirmNewPassword: text })}
          onFocus={() => setFocus("confirm-password")}
        />

        {focus == 'confirm-password' && user.confirmNewPassword.length > 0 && user.newPassword !== user.confirmNewPassword ? <Text style={{color: 'red', marginLeft: 7.5}}>Passwords don't match!</Text> : null}

        <TouchableOpacity 
          disabled={!user.username || !user.oldPassword || !user.newPassword || !user.confirmNewPassword ? true : false} 
          style={{...styles.submitButton, backgroundColor: `${!user.username || !user.oldPassword || !user.newPassword || !user.confirmNewPassword ? 'grey' : '#007bff'}`}}
          onPress={handleSubmit} 
        >
          <Text style={styles.buttonText}>
            Change Password
          </Text>
        </TouchableOpacity>

        {wrongCredentials ? 
          <Text style={{color: 'red', left: 10 }}>
            Invalid Login Credentials.
          </Text> : null
        }
        {successMessage ? 
          <Text style={{color: 'red', left: 10 }}>
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
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1
  },
  innerContainer: {
    paddingTop: 80,
    paddingLeft: 20,
  },
  heading: {
    alignItems: "center",
    margin: 8
  },
  input: {
    height: 40,
    width: "90%",
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    padding: 10
  },
  inputFocus: {
    height: 40,
    width: "90%",
    margin: 8,
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
    borderRadius: 7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17
  },
})

export default ChangePasswordForm;