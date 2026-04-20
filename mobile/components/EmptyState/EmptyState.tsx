import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/theme";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📚</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center",
  },
});
