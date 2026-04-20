import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../styles/theme";
import { searchBooks } from "../../services/apiClient";

interface SearchBarProps {
  onResults?: (books: any[]) => void;
  placeholder?: string;
}

export function SearchBar({
  onResults,
  placeholder = "Search books...",
}: SearchBarProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (value: string) => {
    setText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      onResults?.([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchBooks(value);
        onResults?.(results);
      } catch {
        onResults?.([]);
      }
    }, 300);
  };

  const handleClear = () => {
    setText("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onResults?.([]);
  };

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {text.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.walnut,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  containerFocused: {
    borderColor: colors.mahogany,
  },
  input: {
    flex: 1,
    height: 44,
    color: colors.ink,
    fontSize: 15,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    color: colors.muted,
    fontSize: 16,
  },
});
