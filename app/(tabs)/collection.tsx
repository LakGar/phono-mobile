import { StyleSheet, View, Text } from "react-native";
import Header from "@/components/Header";
const collection = () => {
  return (
    <View style={styles.container}>
      <Header title="Collection" />
    </View>
  );
};

export default collection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
