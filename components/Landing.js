import { useState, useEffect } from "react";
import { Heading } from "native-base";
import { StyleSheet, Text, View, TextInput, SafeAreaView, Image, TouchableOpacity } from "react-native";
import logo from '../assets/todo-ai-logo.png'
import { gql, useMutation } from "@apollo/client";


const LOGIN_MUTATION = gql`
  mutation login($username: String, $password: String) {
    login(username: $username, password: $password) {
      id
      username
      password
    }
}
`

export default function LandingPage({ updateCurrentView }) {
  const [currentView, setCurrentView] = useState("landing");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // data received from useMutation
  const [login, { data }] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      console.log('Complete login')
    }
  });

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error! {error.message}</p>
  // Change input style when the input is focus
  const [focus, setFocus] = useState("");

  function LoginHandler() {
    console.log(username, password)
    login({ variables: { username: username.toLowerCase(), password: password.toLowerCase() } })
    console.log("DATA from FRONTEND: ", data)
    updateCurrentView("dashboard")
  }


  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View>
          <View style={styles.heading}>
            <Heading size="xl" >Welcome to Todo-AI</Heading>
            <Image style={styles.logo} source={logo} />
          </View>

          <TextInput
            autoFocus={true}
            style={focus === "username" ? styles.inputFocus : styles.input}
            value={username}
            placeholder="Username"
            onChangeText={setUsername}
            onFocus={() => setFocus("username")}
          />
          <TextInput
            style={focus === "password" ? styles.inputFocus : styles.input}
            secureTextEntry={true}
            value={password}
            placeholder="Password"
            onChangeText={setPassword}
            onFocus={() => setFocus("password")}
          />

          {currentView === "register" && (
            <TextInput
              style={focus === "confirm-password" ? styles.inputFocus : styles.input}
              value={confirmPassword}
              placeholder="Confirm password"
              onChangeText={setConfirmPassword}
              onFocus={() => setFocus("confirm-password")}
            />
          )}

          {/* Sign in button will appears when user types in both username and password */}
          {(username !== '' && password !== '') &&
            <TouchableOpacity onPress={() => LoginHandler()} style={styles.signInButton}>
              <Text
                style={styles.buttonText}
              >
                {currentView === "landing" ? "Sign in" : "Sign up"}
              </Text>
            </TouchableOpacity>
          }
        </View>

        <View style={styles.footer}>
          {currentView === "landing" ? (
            <Text style={styles.footerText} onPress={() => setCurrentView("register")}>
              Don't have an account? Sign up!
            </Text>
          ) : (
            <Text style={styles.footerText} onPress={() => setCurrentView("landing")}>
              Already have account? Sign in!
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    paddingTop: 80,
    paddingLeft: 10,
    paddingRight: 10
  },
  heading: {
    alignItems: "center",
    marginBottom: 20
  },
  logo: {
    marginTop: 20,
    height: 150
  },
  input: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    padding: 10
  },
  inputFocus: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    borderColor: "#007bff"
  },
  signInButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17
  },
  footer: {
    alignItems: "center",
    marginBottom: 5
  },
  footerText: {
    fontSize: 17,
    color: "#007bff"
  }
});
