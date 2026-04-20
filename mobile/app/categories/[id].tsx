import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header/Header";
import { BookCard } from "@/components/BookCard/BookCard";
import { AdBanner } from "@/components/AdBanner/AdBanner";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { getCategoryById, getBooksByCategory } from "@/services/apiClient";
import { colors } from "@/styles/theme";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [catData, booksData] = await Promise.all([
          getCategoryById(id as string),
          getBooksByCategory(id as string),
        ]);
        setCategory(catData);
        const bookList = Array.isArray(booksData) ? booksData : [];
        const sorted = [...bookList].sort(
          (a, b) => (b.averageStars ?? 0) - (a.averageStars ?? 0),
        );
        setBooks(sorted);
      } catch (error) {
        console.error("Failed to load category data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!category) return <EmptyState message="Category not found" />;

  return (
    <View style={styles.container}>
      <Header title={category.name} showBackButton />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={
          <View>
            <View style={styles.adContainer}>
              <AdBanner />
            </View>
            {category.description && (
              <Text style={styles.description}>{category.description}</Text>
            )}
          </View>
        }
        ListEmptyComponent={<EmptyState message="No books in this category" />}
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
  adContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    paddingHorizontal: 16,
    marginBottom: 8,
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
