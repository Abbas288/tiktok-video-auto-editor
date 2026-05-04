import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEditSession } from "../../src/store/useEditSession";
import { mockBunnyTemplate } from "../../src/data/mockTemplate";
import { colors } from "../../src/styles/theme";

/**
 * Home screen component displaying available video templates.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { loadTemplate } = useEditSession();

  /**
   * Handles opening a project by loading the template and navigating to the editor.
   */
  const handleOpenProject = () => {
    loadTemplate(mockBunnyTemplate);
    router.push(`/(editor)/${mockBunnyTemplate.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tillgängliga Mallar</Text>

      <TouchableOpacity style={styles.card} onPress={handleOpenProject}>
        <Text style={styles.cardTitle}>{mockBunnyTemplate.title}</Text>
        <Text style={styles.cardSub}>
          {mockBunnyTemplate.scenes.length} scener
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  cardSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
});
