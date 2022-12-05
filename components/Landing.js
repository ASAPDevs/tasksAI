import { StyleSheet, Text, View, TextInput } from "react-native";

export default function LandingPage() {
  return (
    <View>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        // onChangeText={onChangeText}
        placeholder="enter email or password"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    border: '1px solid black'
  }
});
