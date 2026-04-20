import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Header } from "@/components/Header/Header";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { BookCard } from "@/components/BookCard/BookCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { colors } from "@/styles/theme";
import i18n from "@/services/i18n";

export default function SearchScreen() {
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleResults = (books: any[]) => {
    setResults(books);
    setSearched(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Search" showBackButton />
      <SearchBar
        placeholder={i18n.t("search_placeholder")}
        onResults={handleResults}
      />
      {searched && results.length === 0 ? (
        <EmptyState message="No books found. Try a different search." />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.column}
          renderItem={({ item }) => <BookCard book={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
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
