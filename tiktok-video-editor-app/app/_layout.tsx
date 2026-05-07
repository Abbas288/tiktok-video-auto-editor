import { Stack } from "expo-router";

/**
 * Root layout component defining the global navigation stack.
 */
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="(home)/index" options={{ title: "My Projects" }} />
      <Stack.Screen
        name="(editor)/[id]"
        options={{ title: "Editor", headerShown: false }}
      />
      <Stack.Screen name="(preview)/[id]" options={{ title: "Preview" }} />
    </Stack>
  );
}
