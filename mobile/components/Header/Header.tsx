import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { colors } from "../../styles/theme";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton = false }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        ) : (
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.espresso,
    flexDirection: "row",
    alignItems: "center",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 10 : 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  left: {
    width: 44,
    alignItems: "flex-start",
  },
  right: {
    width: 44,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 4,
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 32,
  },
});
