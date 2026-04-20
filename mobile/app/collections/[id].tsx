import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header/Header";
import { BookCard } from "@/components/BookCard/BookCard";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import {
  getCollectionById,
  removeBookFromCollection,
} from "@/services/apiClient";
import { colors } from "@/styles/theme";

interface Book {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface Collection {
  id: string;
  name: string;
  books: Book[];
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCollection = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getCollectionById(id);
      setCollection(data);
    } catch (error) {
      console.error("Failed to load collection:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  const handleRemoveBook = (book: Book) => {
    if (!collection) return;
    Alert.alert("Remover Livro", `Remover "${book.title}" desta coleção?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removeBookFromCollection(collection.id, book.id);
            setCollection((prev) =>
              prev
                ? { ...prev, books: prev.books.filter((b) => b.id !== book.id) }
                : prev,
            );
          } catch (error) {
            Alert.alert("Erro", "Não foi possível remover o livro.");
            console.error(error);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner />;
  if (!collection) return <EmptyState message="Coleção não encontrada." />;

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.bookRow}>
      <View style={styles.bookCardWrapper}>
        <BookCard book={item} />
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveBook(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={collection.name} showBackButton />
      <FlatList
        data={collection.books}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState message="Esta coleção ainda não tem livros." />
        }
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: colors.parchment,
    borderRadius: 12,
    padding: 10,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCardWrapper: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: "#C0392B",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 10,
    alignSelf: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
