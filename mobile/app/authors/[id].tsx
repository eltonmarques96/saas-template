import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header/Header";
import { BookCard } from "@/components/BookCard/BookCard";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { getAuthorById, getBooksByAuthor } from "@/services/apiClient";
import { colors } from "@/styles/theme";

interface Author {
  id: string;
  name: string;
  photoUrl?: string;
  bio?: string;
}

export default function AuthorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [authorData, booksData] = await Promise.all([
          getAuthorById(id as string),
          getBooksByAuthor(id as string),
        ]);
        setAuthor(authorData);
        setBooks(Array.isArray(booksData) ? booksData : []);
      } catch (error) {
        console.error("Failed to load author data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!author) return <EmptyState message="Author not found" />;

  return (
    <View style={styles.container}>
      <Header title={author.name} showBackButton />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={
          <View style={styles.authorHeader}>
            {author.photoUrl && (
              <Image
                source={{ uri: author.photoUrl }}
                style={styles.photo}
                resizeMode="cover"
              />
            )}
            <Text style={styles.authorName}>{author.name}</Text>
            {author.bio && <Text style={styles.bio}>{author.bio}</Text>}
            <Text style={styles.booksTitle}>Books</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState message="No books found for this author" />
        }
        renderItem={({ item }) => <BookCard book={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  authorHeader: {
    padding: 16,
    alignItems: "center",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.caramel,
  },
  authorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 8,
    textAlign: "center",
  },
  bio: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  booksTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.espresso,
    marginTop: 8,
    marginBottom: 4,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  column: {
    gap: 12,
    justifyContent: "flex-start",
  },
});
