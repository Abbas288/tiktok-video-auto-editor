import { Stack } from "expo-router";

/**
 * Defines the global app layout.
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#FFFFFF",
      }}
    >
      <Stack.Screen name="(home)/index" options={{ title: "My Projects" }} />
      <Stack.Screen
        name="editor/[id]"
        options={{ title: "Editor", headerShown: false }}
      />
      <Stack.Screen name="preview/[id]" options={{ title: "Preview" }} />
    </Stack>
  );
}
