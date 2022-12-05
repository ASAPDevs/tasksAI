import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useState } from "react";

export default function Menu() {
  const [menu, openMenu] = useState(false);

  const MenuComponent = () => {
    return (
      <View style={styles.menuComponent}>
        <Text>1</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => openMenu(!menu)}>
        <Text style={styles.menu}>&#8801;</Text>
      </TouchableOpacity>
      {menu ? <MenuComponent /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    height: "100%",
  },
  menuComponent: {
    backgroundColor: "lightblue",
    position: "absolute",
    height: Dimensions.get("window").height,
  },
  menu: {
    fontSize: 40,
  },
});
