import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // for sound icon

const data = [
  { letter: "J", sound: require("../../assets/sound/j.m4a") },
  { letter: "V", sound: require("../../assets/sound/v.m4a") },
  { letter: "W", sound: require("../../assets/sound/w.m4a") },
  { letter: "X", sound: require("../../assets/sound/x.m4a") },
  { letter: "Y", sound: require("../../assets/sound/y.m4a") },
  { letter: "Z", sound: require("../../assets/sound/z.m4a") },
  { letter: "Q", sound: require("../../assets/sound/qu.m4a") },
];

export default function LevelJVWXYZScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async (soundFile: any) => {
    if (sound) {
      await sound.unloadAsync(); // unload previous sound
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tap a Letter</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.letter}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.cloudBox}
            onPress={() => {
              playSound(item.sound);
             router.push({
      pathname: "/phonics_page/[letter1]",
      params: { letter: item.letter },
    });
              
            }}
          >
            <View style={styles.letterRow}>
              <Text style={styles.letter}>{item.letter}</Text>
              <Ionicons name="volume-high" size={28} color="#444" />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  cloudBox: {
    backgroundColor: "#d0f0fd",
    paddingVertical: 30,
    marginVertical: 12,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  letterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  letter: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#003366",
  },
});
