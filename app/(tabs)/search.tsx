import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SearchBar } from "@/components/SearchBar";
import { searchDiscogs, SearchResult } from "@/services/discogs";
import { IconSymbol } from "@/components/ui/IconSymbol";
import Header from "@/components/Header";
import { useRouter } from "expo-router";

const categories: {
  name: string;
  icon: SFSymbols6_0;
  genre: string;
  color: string;
}[] = [
  {
    name: "Hip Hop",
    icon: "music.note.list",
    genre: "Hip Hop",
    color: "#FF8CC6",
  },
  { name: "Rock", icon: "guitars", genre: "Rock", color: "#8CC6FF" },
  { name: "Jazz", icon: "music.note", genre: "Jazz", color: "#FFA6B9" },
  {
    name: "Electronic",
    icon: "waveform",
    genre: "Electronic",
    color: "#A6C6FF",
  },
  {
    name: "Classical",
    icon: "music.quarternote.3",
    genre: "Classical",
    color: "#FFA68C",
  },
  { name: "Pop", icon: "music.mic", genre: "Pop", color: "#8CFFB9" },
  { name: "R&B", icon: "music.note", genre: "R&B", color: "#FF8C8C" },
  { name: "Metal", icon: "music.note", genre: "Metal", color: "#B98CFF" },
];

const SearchScreen = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBarRef = useRef<TextInput>(null);

  const headerAnim = useRef(new Animated.Value(1)).current;
  const paddingTopAnim = useRef(new Animated.Value(120)).current;
  const paddingSideAnim = useRef(new Animated.Value(20)).current;
  const categoriesAnim = useRef(new Animated.Value(1)).current;

  const handleFocusChange = (focused: boolean) => {
    setIsSearchFocused(focused);

    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: focused ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(paddingTopAnim, {
        toValue: focused ? 70 : 120,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(paddingSideAnim, {
        toValue: focused ? 16 : 20,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(categoriesAnim, {
        toValue: focused ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCategoryPress = (genre: string) => {
    handleFocusChange(true);
    handleSearch(genre);
    searchBarRef.current?.focus();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError(null);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchDiscogs(query);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No results found. Try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search. Please try again later.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPress = (record: SearchResult) => {
    router.push(`/record/${record.id}`);
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultItem}>
      {item.cover_image || item.thumb ? (
        <Image
          source={{ uri: item.cover_image || item.thumb }}
          style={styles.albumArt}
        />
      ) : (
        <View style={[styles.albumArt, styles.placeholderArt]}>
          <IconSymbol name="music.note" size={24} color="#666666" />
        </View>
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.title}>
          {item.title.length > 30
            ? item.title.slice(0, 30) + "..."
            : item.title}
        </Text>
        {item.year && <Text style={styles.year}>{item.year}</Text>}
        {item.genre && (
          <Text style={styles.genre}>{item.genre.join(", ")}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => handleRecordPress(item)}>
        <IconSymbol name="chevron.right" size={16} color="#666666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: paddingTopAnim,
          paddingHorizontal: paddingSideAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-60, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Header title="Search" />
      </Animated.View>
      <SearchBar
        ref={searchBarRef}
        onSearch={handleSearch}
        onFocusChange={handleFocusChange}
      />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
            style={styles.loader}
          />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={40}
            color="#1DB954"
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No results found</Text>
          }
        />
      ) : (
        <Animated.View
          style={[
            styles.categoriesContainer,
            {
              opacity: categoriesAnim,
              transform: [
                {
                  translateY: categoriesAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoriesGrid}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color },
                ]}
                onPress={() => handleCategoryPress(category.genre)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: "rgba(255, 255, 255, 0.4)" },
                  ]}
                >
                  <IconSymbol name={category.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  list: {
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingBottom: 10,
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  placeholderArt: {
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  year: {
    color: "#1DB954",
    fontSize: 14,
    marginBottom: 4,
  },
  genre: {
    color: "#666666",
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: 40,
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  emptyText: {
    color: "#666666",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 20,
  },
  categoriesTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  categoryCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default SearchScreen;
