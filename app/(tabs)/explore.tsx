import { StyleSheet, View } from "react-native";

import Header from "@/components/Header";
export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Header title="Explore" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
