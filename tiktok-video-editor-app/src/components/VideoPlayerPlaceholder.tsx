import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function VideoPlayerPlaceholder(): React.JSX.Element {
  return (
    <View style={styles.videoPlaceholder}>
      <Text style={{ color: "#fff" }}>Video player will be here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  videoPlaceholder: {
    height: 250,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
  },
});
