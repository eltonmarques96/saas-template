import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import {
  getCollections,
  createCollection,
  deleteCollection,
} from "@/services/apiClient";
import { colors } from "@/styles/theme";

interface BookThumbnail {
  id: string;
  coverUrl?: string;
  title: string;
}

interface Collection {
  id: string;
  name: string;
  books?: BookThumbnail[];
}

export default function CollectionsScreen() {
  const { isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    loadCollections();
  }, [isAuthenticated]);

  const loadCollections = useCallback(async () => {
    try {
      const data = await getCollections();
      setCollections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load collections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a coleção.");
      return;
    }
    setCreating(true);
    try {
      const created = await createCollection(newCollectionName.trim());
      setCollections((prev) => [...prev, created]);
      setNewCollectionName("");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a coleção.");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (collection: Collection) => {
    Alert.alert(
      "Excluir Coleção",
      `Tem certeza que deseja excluir "${collection.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCollection(collection.id);
              setCollections((prev) =>
                prev.filter((c) => c.id !== collection.id),
              );
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a coleção.");
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const renderThumbnails = (books: BookThumbnail[] = []) => {
    const slice = books.slice(0, 3);
    return (
      <View style={styles.thumbnailRow}>
        {slice.map((book) =>
          book.coverUrl ? (
            <Image
              key={book.id}
              source={{ uri: book.coverUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View
              key={book.id}
              style={[styles.thumbnail, styles.thumbnailPlaceholder]}
            >
              <Text style={styles.thumbnailPlaceholderText}>📖</Text>
            </View>
          ),
        )}
        {slice.length === 0 && (
          <Text style={styles.emptyBooksText}>Nenhum livro ainda</Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Collection }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/collections/${item.id}` as any)}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.collectionName}>{item.name}</Text>
          <Text style={styles.bookCount}>
            {item.books?.length ?? 0} livro
            {(item.books?.length ?? 0) !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteIconText}>🗑</Text>
        </TouchableOpacity>
      </View>
      {renderThumbnails(item.books)}
    </TouchableOpacity>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Header title="Minhas Coleções" />

      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState message="Você ainda não tem coleções. Crie sua primeira!" />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nova Coleção</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da coleção"
              placeholderTextColor={colors.muted}
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.modalButton,
                creating && styles.modalButtonDisabled,
              ]}
              onPress={handleCreate}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color={colors.cream} />
              ) : (
                <Text style={styles.modalButtonText}>Criar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName("");
              }}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.parchment,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 2,
  },
  bookCount: {
    fontSize: 13,
    color: colors.muted,
  },
  deleteIcon: {
    padding: 6,
  },
  deleteIconText: {
    fontSize: 18,
  },
  thumbnailRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  thumbnail: {
    width: 48,
    height: 64,
    borderRadius: 4,
  },
  thumbnailPlaceholder: {
    backgroundColor: colors.walnut,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailPlaceholderText: {
    fontSize: 18,
  },
  emptyBooksText: {
    fontSize: 13,
    color: colors.muted,
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mahogany,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    fontSize: 30,
    color: colors.cream,
    lineHeight: 34,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    height: 50,
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.walnut,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 14,
    color: colors.ink,
    fontSize: 15,
  },
  modalButton: {
    backgroundColor: colors.mahogany,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCancelButton: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 8,
  },
  modalCancelText: {
    color: colors.muted,
    fontSize: 15,
  },
});
