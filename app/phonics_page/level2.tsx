import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // for sound icon

const data = [
  { letter: "G", sound: require("../../assets/sound/g.m4a") },
  { letter: "O", sound: require("../../assets/sound/o.m4a") },
  { letter: "C", sound: require("../../assets/sound/c.m4a") },
  { letter: "K", sound: require("../../assets/sound/k.mp3") },
  { letter: "E", sound: require("../../assets/sound/e.m4a") },
  { letter: "U", sound: require("../../assets/sound/u.m4a") },
  { letter: "R", sound: require("../../assets/sound/r.m4a") },
  { letter: "H", sound: require("../../assets/sound/h.m4a") },
  { letter: "B", sound: require("../../assets/sound/b.m4a") },
  { letter: "F", sound: require("../../assets/sound/f.m4a") },
  { letter: "L", sound: require("../../assets/sound/l.m4a") },
];

export default function Level4Screen() {
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
              router.push(
                `/phonics_page/letter_activities/${item.letter.toLowerCase()}`
              );
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
