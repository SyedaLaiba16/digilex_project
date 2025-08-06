import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

const levels = [
  { id: "1", name: "Level 1", route: "/phonics_page/level1" },
  { id: "2", name: "Level 2", route: "/phonics_page/level2" },
  { id: "3", name: "Level 3", route: "/phonics_page/level3" },
  { id: "4", name: "Level 4", route: "/phonics_page/level4" },
  { id: "5", name: "Level 5", route: "/phonics_page/level5" },
];

const PhonicsLevels = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Phonics Levels</Text>
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={item.route} asChild>
            <Pressable style={styles.levelButton}>
              <Text style={styles.levelText}>{item.name}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
};

export default PhonicsLevels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  levelButton: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#0066cc",
    borderRadius: 12,
  },
  levelText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
