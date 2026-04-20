import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors } from "../../styles/theme";
import { StarRating } from "../StarRating/StarRating";

interface Book {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

export function BookCard({ book, onPress }: BookCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/books/${book.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.placeholderText}>📖</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        {book.author && (
          <Text style={styles.author} numberOfLines={1}>
            {book.author.name}
          </Text>
        )}
        {book.averageStars !== undefined && (
          <StarRating value={book.averageStars} readonly />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.parchment,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 180,
  },
  coverPlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: colors.walnut,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 40,
  },
  info: {
    padding: 8,
  },
  title: {
    color: colors.espresso,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    color: colors.muted,
    fontSize: 11,
    marginBottom: 4,
  },
});
