import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
const Header = ({ title }: { title: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* User Image */}
      <TouchableOpacity>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
          }}
          style={styles.userImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
