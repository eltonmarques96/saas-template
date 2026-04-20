import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../styles/theme";

interface ButtonProps {
  style?: ViewStyle;
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ style, title, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mahogany,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.cream,
  },
});

export default Button;
