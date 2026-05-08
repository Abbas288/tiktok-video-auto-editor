import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { templateRepository } from "../../src/infrastructure/templateRepository";
import { Template } from "../../src/types/template";
import { colors } from "../../src/styles/theme";

/**
 * Home screen component displaying available video templates.
 * Fetches templates asynchronously from the repository.
 */
export default function HomeScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Fetches available templates from the repository and updates local state.
     */
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await templateRepository.getAvailableTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  /**
   * Handles opening a project by navigating to the editor.
   *
   * @param {string} id - The unique identifier of the selected template.
   */
  const handleOpenProject = (id: string) => {
    router.push(`/editor/${id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Templates</Text>

      {templates.map((template) => (
        <TouchableOpacity
          key={template.id}
          style={styles.card}
          onPress={() => handleOpenProject(template.id)}
        >
          <Text style={styles.cardTitle}>{template.title}</Text>
          <Text style={styles.cardSub}>{template.scenes.length} scenes</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
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
