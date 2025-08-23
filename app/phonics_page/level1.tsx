import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // for sound icon
import { useRouter } from "expo-router"; // ✅ sahi import

const data = [
  { letter: "S", sound: require("../../assets/sound/s.m4a") },
  { letter: "A", sound: require("../../assets/sound/a.m4a") },
  { letter: "T", sound: require("../../assets/sound/t.m4a") },
  { letter: "P", sound: require("../../assets/sound/p.m4a") },
  { letter: "I", sound: require("../../assets/sound/i.m4a") },
  { letter: "N", sound: require("../../assets/sound/n.m4a") },
  { letter: "M", sound: require("../../assets/sound/m.m4a") },
  { letter: "D", sound: require("../../assets/sound/d.m4a") },
];

export default function Level1Screen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();

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
            onPress={async () => {
              await playSound(item.sound); // pehle sound play kare
              router.push({
                pathname: "phonics_page/[letter1]", // ✅ dynamic route
                params: { letter: item.letter },   // ✅ param bhejna
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
