import { StyleSheet, View, Text, ScrollView } from "react-native";
import Header from "@/components/Header";
import { IconSymbol } from "@/components/ui/IconSymbol";

const collection = () => {
  return (
    <View style={styles.container}>
      <Header title="Collection" />
      <ScrollView style={styles.content}>
        <View style={styles.menuItem}>
          <IconSymbol name="music.note.list" size={24} color="#1DB954" />
          <Text style={styles.menuText}>Collection</Text>
          <IconSymbol
            style={styles.button}
            name="chevron.right"
            size={16}
            color="grey"
          />
        </View>
        <View style={styles.menuItem}>
          <IconSymbol name="person.2" size={24} color="#1DB954" />
          <Text style={styles.menuText}>Artists</Text>
          <IconSymbol
            style={styles.button}
            name="chevron.right"
            size={16}
            color="grey"
          />
        </View>
        <View style={styles.menuItem}>
          <IconSymbol name="star" size={24} color="#1DB954" />
          <Text style={styles.menuText}>Made for You</Text>
          <IconSymbol
            style={styles.button}
            name="chevron.right"
            size={16}
            color="grey"
          />
        </View>
        <View style={styles.menuItem}>
          <IconSymbol name="heart" size={24} color="#1DB954" />
          <Text style={styles.menuText}>Wishlist</Text>
          <IconSymbol
            style={styles.button}
            name="chevron.right"
            size={16}
            color="grey"
          />
        </View>
        <View style={styles.menuItem}>
          <IconSymbol name="music.note" size={24} color="#1DB954" />
          <Text style={styles.menuText}>Genres</Text>
          <IconSymbol
            style={styles.button}
            name="chevron.right"
            size={16}
            color="grey"
          />
        </View>
        <View style={styles.recentlyAdded}>
          <Text style={styles.recentlyAddedText}>Recently Added</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default collection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  menuText: {
    color: "white",
    fontSize: 16,
    marginLeft: 16,
  },
  button: {
    marginLeft: "auto",
  },
  recentlyAdded: {
    marginTop: 20,
  },
  recentlyAddedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
