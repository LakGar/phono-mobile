import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { searchDiscogs, getRecordById, SearchResult } from "@/services/discogs";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 400;
const COVER_SIZE = width * 0.6;

const RecordDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInCollection, setIsInCollection] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [width * 0.5, width * 0.7, width * 2],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });
  const headerScale = scrollY.interpolate({
    inputRange: [width * 0.5, width * 0.7, width * 2],
    outputRange: [0.8, 1, 1],
    extrapolate: "clamp",
  });
  const headerBackground = scrollY.interpolate({
    inputRange: [width * 0.5, width * 0.7, width * 2],
    outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,1)", "rgba(0,0,0,1)"],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) {
        setError("No record ID provided");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First try to get the record directly by ID
        const record = await getRecordById(Array.isArray(id) ? id[0] : id);

        if (record) {
          setRecord(record);
          return;
        }

        // If direct fetch fails, try searching
        const results = await searchDiscogs(
          `id:${Array.isArray(id) ? id[0] : id}`
        );
        if (results.length > 0) {
          setRecord(results[0]);
        } else {
          setError("Record not found");
        }
      } catch (err) {
        console.error("Error fetching record:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch record");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    );
  }

  if (error || !record) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={40} color="#fff" />
          <Text style={styles.errorText}>{error || "Record not found"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { backgroundColor: headerBackground }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <Image
            source={{ uri: record?.cover_image }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {record?.title}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: record?.cover_image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.coverGradient}
          />
        </View>

        <View style={styles.basicInfo}>
          <Text style={styles.genre}>{record.genre?.[0]}</Text>
          <Text style={styles.artist}>{record.artists?.[0]?.name}</Text>
          <Text style={styles.year}>{record.year}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, isInCollection && styles.activeButton]}
            onPress={() => setIsInCollection(!isInCollection)}
          >
            <IconSymbol
              name={isInCollection ? "checkmark.circle.fill" : "plus.circle"}
              size={28}
              color={isInCollection ? "#1DB954" : "#FFFFFF"}
            />
            <Text
              style={[
                styles.actionButtonText,
                isInCollection && styles.activeButtonText,
              ]}
            >
              Collection
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isInWishlist && styles.activeButton]}
            onPress={() => setIsInWishlist(!isInWishlist)}
          >
            <IconSymbol
              name={isInWishlist ? "heart.fill" : "heart"}
              size={28}
              color={isInWishlist ? "#1DB954" : "#FFFFFF"}
            />
            <Text
              style={[
                styles.actionButtonText,
                isInWishlist && styles.activeButtonText,
              ]}
            >
              Wishlist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.activeButton]}
            onPress={() => setIsLiked(!isLiked)}
          >
            <IconSymbol
              name={isLiked ? "hand.thumbsup.fill" : "hand.thumbsup"}
              size={28}
              color={isLiked ? "#1DB954" : "#FFFFFF"}
            />
            <Text
              style={[
                styles.actionButtonText,
                isLiked && styles.activeButtonText,
              ]}
            >
              Like
            </Text>
          </TouchableOpacity>
        </View>

        {record.tracklist && record.tracklist.length > 0 && (
          <View style={styles.tracklistSection}>
            <Text style={styles.sectionTitle}>Tracklist</Text>
            {record.tracklist.map(
              (
                track: { position: string; title: string; duration: string },
                index: number
              ) => (
                <View key={index} style={styles.trackItem}>
                  <Text style={styles.trackPosition}>{track.position}</Text>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <TouchableOpacity style={styles.playButton}>
                    <IconSymbol
                      name="play.circle.fill"
                      size={28}
                      color="#1DB954"
                    />
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailItem}>
            <IconSymbol name="music.note" size={20} color="#666666" />
            <Text style={styles.detailText}>{record.format?.join(" • ")}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="globe" size={20} color="#666666" />
            <Text style={styles.detailText}>Country: {record.country}</Text>
          </View>
        </View>

        {record.genre && record.genre.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genreContainer}>
              {record.genre.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreTagText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {record.style && record.style.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Styles</Text>
            <View style={styles.genreContainer}>
              {record.style.map((style, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreTagText}>{style}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
    marginBottom: 100,
  },
  coverContainer: {
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: width,
    backgroundColor: "#1A1A1A",
  },
  coverGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  basicInfo: {
    padding: 24,
    backgroundColor: "#000000",
  },
  genre: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  artist: {
    color: "#FFFFFF",
    fontSize: 24,
    marginBottom: 4,
  },
  year: {
    color: "#666666",
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderRadius: 12,
  },
  actionButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    minWidth: 100,
  },
  activeButton: {
    backgroundColor: "rgba(29,185,84,0.2)",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
  activeButtonText: {
    color: "#1DB954",
  },
  tracklistSection: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  section: {
    padding: 20,
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  trackPosition: {
    color: "#666666",
    fontSize: 14,
    width: 40,
  },
  trackTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  playButton: {
    padding: 8,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreTag: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreTagText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
  },
});

export default RecordDetailScreen;
