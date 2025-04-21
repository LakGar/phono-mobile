import React, { useState, useRef, forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
  placeholder?: string;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ onSearch, onFocusChange, placeholder = "Search records..." }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (text: string) => {
      setSearchQuery(text);
      onSearch(text);
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocusChange?.(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      onFocusChange?.(false);
    };

    const handleCancel = () => {
      handleSearch("");
      if (ref && "current" in ref) {
        ref.current?.blur();
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#666666" />
          <TextInput
            ref={ref}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#666666" />
            </TouchableOpacity>
          )}
        </View>
        {isFocused && (
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 8,
    padding: 8,
  },
  cancelText: {
    color: "#1DB954",
    fontSize: 16,
  },
});
