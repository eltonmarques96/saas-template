import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header/Header";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { BookCard } from "@/components/BookCard/BookCard";
import { AdBanner } from "@/components/AdBanner/AdBanner";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { getPopularBooks, getCategories } from "@/services/apiClient";
import { colors } from "@/styles/theme";
import i18n from "@/services/i18n";

interface Category {
  id: string;
  name: string;
}

const HomeScreen = () => {
  const { isAuthenticated } = useAuth();
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [books, cats] = await Promise.all([
        getPopularBooks(10),
        getCategories(),
      ]);
      setPopularBooks(Array.isArray(books) ? books : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error("Failed to load home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Header title={i18n.t("home_title")} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <SearchBar
          placeholder={i18n.t("search_placeholder")}
          onResults={handleSearchResults}
        />

        {isSearching ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.length === 0 ? (
              <EmptyState message="No books found" />
            ) : (
              <FlatList
                data={searchResults}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BookCard book={item} />}
                contentContainerStyle={styles.horizontalList}
              />
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {i18n.t("popular_books")}
                </Text>
                {!isAuthenticated && (
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.loginPrompt}>{i18n.t("login")}</Text>
                  </TouchableOpacity>
                )}
              </View>
              {popularBooks.length === 0 ? (
                <EmptyState message="No popular books available" />
              ) : (
                <FlatList
                  data={popularBooks}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <BookCard book={item} />}
                  contentContainerStyle={styles.horizontalList}
                />
              )}
            </View>

            <View style={styles.adContainer}>
              <AdBanner />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t("categories")}</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryChip}
                    onPress={() => router.push(`/categories/${cat.id}` as any)}
                  >
                    <Text style={styles.categoryText}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {isAuthenticated && (
              <TouchableOpacity
                style={styles.collectionsButton}
                onPress={() => router.push("/collections" as any)}
              >
                <Text style={styles.collectionsButtonText}>
                  {i18n.t("my_collections")}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 12,
  },
  loginPrompt: {
    color: colors.mahogany,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  horizontalList: {
    paddingRight: 16,
  },
  adContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: colors.parchment,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.walnut,
  },
  categoryText: {
    color: colors.mahogany,
    fontSize: 13,
    fontWeight: "600",
  },
  collectionsButton: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: colors.espresso,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  collectionsButtonText: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPad: {
    height: 40,
  },
});

export default HomeScreen;
