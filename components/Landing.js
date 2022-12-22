import { useEffect, useState, useLayoutEffect } from "react";
import { Heading } from "native-base";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import logo from "../assets/AI-TODO.png";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/storageSlice";
import { SIGNUP_MUTATION, LOGIN_MUTATION } from "./helpers/mutations";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import * as SecureStore from "expo-secure-store";

const LandingPage = ({ updateCurrentView, navigation }) => {
  const [currentView, setCurrentView] = useState("landing");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focus, setFocus] = useState("");
  const [wrongLogin, toggleWrongLogin] = useState(false);
  const [wrongSignup, toggleWrongSignup] = useState(false);
  const loggedInStatus = useSelector((state) => state.storage.loggedIn);

  const dispatch = useDispatch();

  // data received from useMutation
  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      dispatch(
        loginUser({
          username: data.login.username,
          user_id: Number(data.login.id),
        })
      );
      navigation.navigate("Root", {screen: "Dashboard"})
      // updateCurrentView('dashboard')
    },
    onError: (err) => {
      console.log("Error in login mutation: ", err);
      toggleWrongLogin(true);
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      dispatch(
        loginUser({
          username: data.signup.username,
          user_id: Number(data.signup.id),
        })
      );
      navigation.navigate("Root", {screen: "Dashboard"})
    },
    onError: (err) => {
      console.log("Error in signup mutation: ", err);
      toggleWrongSignup(true);
    },
  });


  const loginHandler = async () => {
    try {
      // await SecureStore.setItemAsync(key, val);
      const result = await login({
        variables: { username: username, password: password },
      });
      
      if (result.data) {
        await SecureStore.setItemAsync("username", result.data.login.username);
        await SecureStore.setItemAsync("userid", result.data.login.id);
        // navigation.navigate('Root', { screen: 'Dashboard' })
      }
    } catch (err) {
      console.log("The error" + err);
    }
  };

  const signupHandler = async () => {
    try {
      const result = await signup({
        variables: { email: email, password: password, username: username },
      });
      if (result.data) {
        await SecureStore.setItemAsync("username", result.data.signup.username);
        await SecureStore.setItemAsync("userid", result.data.signup.id);
      }
    } catch (err) {
      console.log("Signup error" + err);
    }
  };


    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <View>
            <View style={styles.heading}>
              <Heading size="xl"></Heading>
              <Image style={styles.logo} source={logo} />
            </View>
            {currentView === "register" && (
              <TextInput
                autoFocus={currentView === "register" ? true : false}
                autoCapitalize="none"
                style={styles.input}
                value={email}
                placeholder="Email Address"
                onChangeText={setEmail}
                onFocus={() => setFocus("email")}
              />
            )}
            <TextInput
              autoFocus={currentView === "login" ? true : false}
              autoCapitalize="none"
              style={focus === "username" ? styles.inputFocus : styles.input}
              value={username}
              placeholder="Username"
              onChangeText={setUsername}
              onFocus={() => setFocus("username")}
            />
            <TextInput
              autoCapitalize="none"
              style={focus === "password" ? styles.inputFocus : styles.input}
              secureTextEntry={true}
              value={password}
              placeholder="Password"
              onChangeText={setPassword}
              onFocus={() => setFocus("password")}
            />

            {/* Signup View */}
            {currentView === "register" && (
              <>
                <TextInput
                  autoCapitalize="none"
                  style={
                    focus === "confirm-password"
                      ? styles.inputFocus
                      : styles.input
                  }
                  value={confirmPassword}
                  secureTextEntry={true}
                  placeholder="Confirm password"
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocus("confirm-password")}
                />
                {focus == "confirm-password" &&
                confirmPassword.length > 0 &&
                password !== confirmPassword ? (
                  <Text style={{ color: "red", marginLeft: 7.5 }}>
                    Passwords don't match!
                  </Text>
                ) : null}
              </>
            )}

            {/* Conditionally renders button according to signup/login state */}
            {currentView == "landing" && (
              <TouchableOpacity
                disabled={!username || !password ? true : false}
                onPress={loginHandler}
                style={{
                  ...styles.signInButton,
                  backgroundColor: `${
                    !username || !password ? "grey" : "#FAA946"
                  }`,
                }}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            )}

            {currentView == "register" && (
              <TouchableOpacity
                disabled={
                  !username || !password || !email || !confirmPassword
                    ? true
                    : false
                }
                onPress={signupHandler}
                style={{
                  ...styles.signInButton,
                  backgroundColor: `${
                    !username || !password || !email || !confirmPassword
                      ? "grey"
                      : "#FAA946"
                  }`,
                }}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}

            {wrongLogin ? (
              <Text style={{ color: "red", textAlign: "center" }}>
                Invalid Login Credentials.
              </Text>
            ) : null}
            {wrongSignup ? (
              <Text style={{ color: "red", textAlign: "center" }}>
                Invalid Signup. Check All Inputs.
              </Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            {currentView === "landing" ? (
              <Text
                style={styles.footerText}
                onPress={() => {
                  setCurrentView("register");
                  setUsername("");
                  setPassword("");
                  setFocus("email");
                  toggleWrongLogin(false);
                }}
              >
                Don't have an account? Sign up!
              </Text>
            ) : (
              <Text
                style={styles.footerText}
                onPress={() => {
                  setCurrentView("landing");
                  setUsername("");
                  setPassword("");
                }}
              >
                Already have account? Sign in!
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    paddingTop: 80,
    paddingLeft: 10,
    paddingRight: 10,
  },
  heading: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    marginTop: 20,
    height: 150,
  },
  input: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
  },
  inputFocus: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    borderColor: "#007bff",
  },
  signInButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  footer: {
    alignItems: "center",
    marginBottom: 5,
  },
  footerText: {
    fontSize: 17,
    color: "#007bff",
  },
});

export default LandingPage;
