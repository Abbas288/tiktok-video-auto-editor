import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  TEMPLATE_GUIDE_PROMPT,
  TEMPLATE_GUIDE_SECTIONS,
  TEMPLATE_GUIDE_STEPS,
} from "../../domain/template/templateGuideContent";
import { colors } from "../../styles/theme";
import { AppNavbar } from "../AppNavbar";

type CopyStatus = "idle" | "success" | "error";

/**
 * Renders a short guide that explains template content and user expectations.
 *
 * @returns Template guide screen.
 */
export function TemplateGuideScreen(): React.JSX.Element {
  const router = useRouter();
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const handleGoBack = useCallback((): void => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [router]);

  const handleCopyPrompt = useCallback(async (): Promise<void> => {
    try {
      const didCopy = await Clipboard.setStringAsync(TEMPLATE_GUIDE_PROMPT);

      if (!didCopy) {
        throw new Error("Clipboard rejected the prompt.");
      }

      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }, []);

  return (
    <View style={styles.container}>
      <AppNavbar showBackButton projectTitle="Guide" onBack={handleGoBack} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        testID="template-guide-screen"
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialIcons
              name="info-outline"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.heroText}>
            <Text style={styles.title}>Template guide</Text>
            <Text style={styles.subtitle}>
              What the JSON controls and what you add.
            </Text>
          </View>
        </View>

        <View style={styles.sectionGrid}>
          {TEMPLATE_GUIDE_SECTIONS.map((section) => (
            <View key={section.title} style={styles.infoCard}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardBody}>{section.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Flow</Text>

          <View style={styles.stepList}>
            {TEMPLATE_GUIDE_STEPS.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>

                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.snippetHeader}>
            <View>
              <Text style={styles.panelTitle}>AI prompt</Text>
              <Text style={styles.panelSubtitle}>
                Use with a video reference.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                void handleCopyPrompt();
              }}
              testID="copy-template-guide-prompt-button"
              accessibilityRole="button"
              accessibilityLabel="Copy AI prompt"
            >
              <MaterialIcons name="content-copy" size={17} color="#000000" />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>

          {copyStatus !== "idle" ? (
            <Text
              style={[
                styles.copyMessage,
                copyStatus === "error" ? styles.errorText : styles.successText,
              ]}
              testID="template-guide-copy-message"
            >
              {copyStatus === "success" ? "Prompt copied." : "Could not copy."}
            </Text>
          ) : null}

          <View style={styles.codeBox} testID="template-guide-prompt-box">
            <Text style={styles.codeMarker}>BEGIN AI PROMPT</Text>
            <Text
              selectable
              style={styles.codeText}
              testID="template-guide-prompt-snippet"
            >
              {TEMPLATE_GUIDE_PROMPT}
            </Text>
            <Text style={styles.codeMarker}>END AI PROMPT</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    padding: 14,
    gap: 12,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0, 214, 249, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 214, 249, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionGrid: {
    gap: 10,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  panelSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "700",
  },
  stepList: {
    gap: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#2F3B45",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  stepText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
  snippetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  copyButton: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  copyButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "900",
  },
  copyMessage: {
    fontSize: 13,
    fontWeight: "800",
  },
  successText: {
    color: colors.accent,
  },
  errorText: {
    color: colors.error,
  },
  codeBox: {
    borderRadius: 14,
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: "#2F3B45",
    padding: 12,
    gap: 8,
  },
  codeMarker: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  codeText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Platform.select({
      web: "monospace",
      default: undefined,
    }),
  },
});
