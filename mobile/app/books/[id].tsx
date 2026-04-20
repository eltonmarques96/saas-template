import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header/Header";
import { StarRating } from "@/components/StarRating/StarRating";
import { AdBanner } from "@/components/AdBanner/AdBanner";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import {
  getBookById,
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
  getCollections,
  addBookToCollection,
} from "@/services/apiClient";
import { colors } from "@/styles/theme";
import i18n from "@/services/i18n";

interface Review {
  id: string;
  stars: number;
  comment?: string;
  user?: { id: string; firstName: string; lastName: string };
  userId?: string;
}

interface Collection {
  id: string;
  name: string;
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && collectionModalVisible) {
      getCollections().then(setCollections).catch(console.error);
    }
  }, [isAuthenticated, collectionModalVisible]);

  const loadData = async () => {
    try {
      const bookData = await getBookById(id as string);
      setBook(bookData);

      try {
        const reviewsData = await getReviewsByBook(bookData.id);
        const reviewList = Array.isArray(reviewsData) ? reviewsData : [];
        setReviews(reviewList);
        if (user) {
          const mine = reviewList.find(
            (r: Review) => r.userId === user.id || r.user?.id === user.id,
          );
          if (mine) {
            setMyReview(mine);
            setReviewStars(mine.stars);
            setReviewComment(mine.comment ?? "");
          }
        }
      } catch {
        setReviews([]);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewStars) {
      alert("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      if (myReview && editingReview) {
        await updateReview(myReview.id, {
          stars: reviewStars,
          comment: reviewComment,
        });
      } else {
        await createReview({
          bookId: id as string,
          stars: reviewStars,
          comment: reviewComment,
        });
      }
      setEditingReview(false);
      await loadData();
    } catch (error) {
      alert("Failed to submit review.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = () => {
    if (!myReview) return;
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete your review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview(myReview.id);
              setMyReview(null);
              setReviewStars(0);
              setReviewComment("");
              await loadData();
            } catch (error) {
              alert("Failed to delete review.");
            }
          },
        },
      ],
    );
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await addBookToCollection(collectionId, id as string);
      setCollectionModalVisible(false);
      alert("Book added to collection!");
    } catch (error) {
      alert("Failed to add to collection.");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (notFound || !book) {
    return (
      <View style={styles.container}>
        <Header title="Livro não encontrado" showBackButton />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundEmoji}>📚</Text>
          <Text style={styles.notFoundTitle}>Livro não encontrado</Text>
          <Text style={styles.notFoundMessage}>
            Este livro não existe no nosso acervo nem foi encontrado no
            OpenLibrary.
          </Text>
          <TouchableOpacity
            style={styles.notFoundButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.notFoundButtonText}>Voltar para o início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const otherReviews = reviews.filter(
    (r) => r.userId !== user?.id && r.user?.id !== user?.id,
  );

  return (
    <View style={styles.container}>
      <Header title={book.title} showBackButton />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {book.coverUrl && (
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <Text style={styles.bookTitle}>{book.title}</Text>

          {book.author && (
            <TouchableOpacity
              onPress={() => router.push(`/authors/${book.author.id}` as any)}
            >
              <Text style={styles.authorLink}>{book.author.name}</Text>
            </TouchableOpacity>
          )}

          {book.categories && book.categories.length > 0 && (
            <View style={styles.categoriesRow}>
              {book.categories.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryChip}
                  onPress={() => router.push(`/categories/${cat.id}` as any)}
                >
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {book.synopsis && (
            <Text style={styles.synopsis}>{book.synopsis}</Text>
          )}

          <View style={styles.metaContainer}>
            {book.pages && <Text style={styles.meta}>Pages: {book.pages}</Text>}
            {book.publisher && (
              <Text style={styles.meta}>Publisher: {book.publisher}</Text>
            )}
            {book.isbn && <Text style={styles.meta}>ISBN: {book.isbn}</Text>}
          </View>

          <View style={styles.adContainer}>
            <AdBanner />
          </View>

          {isAuthenticated && (
            <TouchableOpacity
              style={styles.addCollectionButton}
              onPress={() => setCollectionModalVisible(true)}
            >
              <Text style={styles.addCollectionText}>
                {i18n.t("add_to_collection")}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {book.averageStars !== undefined && (
              <View style={styles.avgRow}>
                <StarRating value={book.averageStars} readonly />
                <Text style={styles.avgText}>
                  {Number(book.averageStars).toFixed(1)} / 5
                </Text>
              </View>
            )}

            {isAuthenticated && (
              <View style={styles.reviewForm}>
                <Text style={styles.reviewFormTitle}>
                  {myReview && !editingReview
                    ? "Your Review"
                    : "Write a Review"}
                </Text>
                {myReview && !editingReview ? (
                  <View>
                    <StarRating value={myReview.stars} readonly />
                    {myReview.comment && (
                      <Text style={styles.reviewComment}>
                        {myReview.comment}
                      </Text>
                    )}
                    <View style={styles.reviewActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setEditingReview(true)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteReview}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <StarRating value={reviewStars} onChange={setReviewStars} />
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Add a comment (optional)"
                      placeholderTextColor={colors.muted}
                      value={reviewComment}
                      onChangeText={setReviewComment}
                      multiline
                      numberOfLines={3}
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmitReview}
                      disabled={submitting}
                    >
                      <Text style={styles.submitButtonText}>
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Text>
                    </TouchableOpacity>
                    {editingReview && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setEditingReview(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}

            {otherReviews.length === 0 ? (
              <EmptyState message={i18n.t("no_reviews")} />
            ) : (
              otherReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <Text style={styles.reviewUser}>
                    {review.user
                      ? `${review.user.firstName} ${review.user.lastName}`
                      : "Anonymous"}
                  </Text>
                  <StarRating value={review.stars} readonly />
                  {review.comment && (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
        <View style={styles.bottomPad} />
      </ScrollView>

      <Modal
        visible={collectionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCollectionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add to Collection</Text>
            {collections.length === 0 ? (
              <Text style={styles.noCollectionsText}>
                No collections yet. Create one first.
              </Text>
            ) : (
              <FlatList
                data={collections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.collectionItem}
                    onPress={() => handleAddToCollection(item.id)}
                  >
                    <Text style={styles.collectionItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setCollectionModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
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
  scroll: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 280,
  },
  content: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 8,
  },
  authorLink: {
    fontSize: 16,
    color: colors.mahogany,
    textDecorationLine: "underline",
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: colors.parchment,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.walnut,
  },
  categoryText: {
    color: colors.mahogany,
    fontSize: 12,
  },
  synopsis: {
    fontSize: 15,
    color: colors.ink,
    lineHeight: 24,
    marginBottom: 16,
  },
  metaContainer: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.muted,
  },
  adContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  addCollectionButton: {
    backgroundColor: colors.walnut,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  addCollectionText: {
    color: colors.cream,
    fontSize: 15,
    fontWeight: "600",
  },
  reviewsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 12,
  },
  avgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  avgText: {
    fontSize: 15,
    color: colors.muted,
  },
  reviewForm: {
    backgroundColor: colors.parchment,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  reviewFormTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.espresso,
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.walnut,
    borderRadius: 8,
    padding: 10,
    color: colors.ink,
    marginTop: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.mahogany,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: colors.cream,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.muted,
    fontSize: 14,
  },
  reviewActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: colors.walnut,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editButtonText: {
    color: colors.cream,
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: "#C0392B",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: colors.parchment,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: "600",
    color: colors.espresso,
    marginBottom: 4,
  },
  reviewComment: {
    color: colors.ink,
    fontSize: 14,
    marginTop: 6,
  },
  bottomPad: {
    height: 40,
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
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 16,
  },
  noCollectionsText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
    padding: 20,
  },
  collectionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.parchment,
  },
  collectionItemText: {
    fontSize: 16,
    color: colors.ink,
  },
  modalCloseButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: colors.parchment,
    borderRadius: 8,
  },
  modalCloseText: {
    color: colors.mahogany,
    fontSize: 15,
    fontWeight: "600",
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  notFoundEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.espresso,
    marginBottom: 12,
    textAlign: "center",
  },
  notFoundMessage: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  notFoundButton: {
    backgroundColor: colors.mahogany,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  notFoundButtonText: {
    color: colors.cream,
    fontSize: 15,
    fontWeight: "600",
  },
});
