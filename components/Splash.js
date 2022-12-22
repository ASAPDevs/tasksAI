import { ActivityIndicator, View , StyleSheet } from "react-native";



const Splash = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <ActivityIndicator size={"large"} color="orange" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  innerContainer: {
    paddingTop: 30,
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 22,
    margin: 10,
    fontFamily: "FamiljenGrotesk",
  },
});

export default Splash;