import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  useColorScheme,
} from "react-native";
import { Colors } from "../../constants/Colors";
interface ButtonProps {
  style?: ViewStyle;
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ style, title, onPress }) => {
  const colorScheme = useColorScheme();

  const backgroundColor =
    colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint;
  const textColor =
    colorScheme === "dark" ? Colors.light.text : Colors.dark.text;

  return (
    <TouchableOpacity
      style={[styles.button, style, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
