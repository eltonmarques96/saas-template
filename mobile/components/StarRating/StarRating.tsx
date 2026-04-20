import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../../styles/theme";

interface StarRatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  onChange?: (n: number) => void;
}

export function StarRating({
  value,
  max = 5,
  readonly = false,
  onChange,
}: StarRatingProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        const star = (
          <Text
            key={i}
            style={[
              styles.star,
              { color: filled ? colors.caramel : colors.muted },
            ]}
          >
            ★
          </Text>
        );
        if (readonly || !onChange) return star;
        return (
          <Pressable key={i} onPress={() => onChange(i + 1)}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 20,
    marginRight: 2,
  },
});
