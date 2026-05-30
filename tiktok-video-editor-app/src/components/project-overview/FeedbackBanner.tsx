import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProjectFeedbackMessage } from "../../application/useProjectOverviewController";
import { colors } from "../../styles/theme";
import { MaterialIconName } from "./HomeActionButton";

export interface FeedbackBannerProps {
  feedback: ProjectFeedbackMessage;
}

/**
 * Renders user feedback for project overview actions.
 *
 * @param props Feedback message.
 * @returns Feedback banner element.
 */
export function FeedbackBanner({
  feedback,
}: FeedbackBannerProps): React.JSX.Element {
  const isError = feedback.type === "error";
  const isSuccess = feedback.type === "success";
  const iconName: MaterialIconName = isError
    ? "error-outline"
    : isSuccess
      ? "check-circle"
      : "info-outline";

  return (
    <View
      style={[
        styles.feedbackBanner,
        isError && styles.feedbackError,
        isSuccess && styles.feedbackSuccess,
      ]}
      testID="home-feedback-banner"
    >
      <MaterialIcons
        name={iconName}
        size={18}
        color={
          isError ? colors.error : isSuccess ? colors.accent : colors.primary
        }
      />

      <Text style={styles.feedbackText}>{feedback.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackBanner: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#2F3B45",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedbackError: {
    borderColor: "rgba(255, 93, 115, 0.45)",
  },
  feedbackSuccess: {
    borderColor: "rgba(0, 255, 208, 0.45)",
  },
  feedbackText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
});
