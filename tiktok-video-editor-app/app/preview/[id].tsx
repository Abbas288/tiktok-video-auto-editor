import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "../../src/styles/theme";
import { normalizeRouteParam } from "../../src/utils/normalizeRouteParam";

/**
 * Screen component for video previewing.
 */
export default function PreviewScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const templateId = normalizeRouteParam(id);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Preview for project: {templateId ?? "No template id provided."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.text,
    fontSize: 18,
  },
});
