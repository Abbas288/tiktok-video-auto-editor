import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

interface AppNavbarProps {
  projectTitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const HIT_SLOP = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export function AppNavbar({
  projectTitle,
  showBackButton = false,
  onBack,
}: AppNavbarProps): React.JSX.Element {
  const router = useRouter();

  const handleOpenProjects = useCallback((): void => {
    router.replace("/");
  }, [router]);

  return (
    <View style={styles.navbar} testID="app-navbar">
      <View style={styles.navbarShell}>
        {showBackButton ? (
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
            onPress={onBack}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="navbar-back-button"
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.projectsLink,
            pressed && styles.pressed,
          ]}
          onPress={handleOpenProjects}
          hitSlop={HIT_SLOP}
          accessibilityRole="link"
          accessibilityLabel="Open My Projects"
          testID="my-projects-nav-link"
        >
          <View style={styles.projectsIconBadge}>
            <MaterialIcons name="home" size={18} color={colors.primary} />
          </View>

          <Text style={styles.projectsText}>My Projects</Text>
        </Pressable>

        {projectTitle ? (
          <View style={styles.projectTitleBox}>
            <Text
              style={styles.projectTitle}
              numberOfLines={1}
              testID="navbar-project-title"
            >
              {projectTitle}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#222831",
  },
  navbarShell: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    minHeight: 78,
    paddingHorizontal: 14,
    paddingTop: 32,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
  },
  projectsLink: {
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingLeft: 8,
    paddingRight: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressed: {
    opacity: 0.68,
    transform: [{ scale: 0.98 }],
  },
  projectsIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 214, 249, 0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  projectsText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  projectTitleBox: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    backgroundColor: "rgba(20, 20, 20, 0.72)",
    borderWidth: 1,
    borderColor: "#222831",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  projectTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
});
