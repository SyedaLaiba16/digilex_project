import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import React, { useState } from "react";

const letterData = {
  S: {
    sound: require("../../../assets/sound/s.m4a"),
    words: [
      { label: "Sun", image: require("../../../assets/images/sun.png") },
      { label: "Snake", image: require("../../../assets/images/snake.png") },
    ],
  },
  A: {
    sound: require("../../../assets/sound/a.m4a"),
    words: [
      { label: "Ant", image: require("../../../assets/images/ant.png") },
      { label: "Apple", image: require("../../../assets/images/apple.png") },
    ],
  },
  T: {
    sound: require("../../../assets/sound/t.m4a"),
    words: [
      { label: "Tree", image: require("../../../assets/images/tree.png") },
      { label: "Train", image: require("../../../assets/images/train.png") },
    ],
  },
  P: {
    sound: require("../../../assets/sound/p.m4a"),
    words: [
      { label: "Pen", image: require("../../../assets/images/pen.png") },
      { label: "Pin", image: require("../../../assets/images/pin.png") },
    ],
  },
  I: {
    sound: require("../../../assets/sound/i.m4a"),
    words: [
      { label: "Igloo", image: require("../../../assets/images/igloo.jpg") },
      { label: "Insect", image: require("../../../assets/images/insect.jpg") },
    ],
  },
  N: {
    sound: require("../../../assets/sound/n.m4a"),
    words: [
      { label: "Nest", image: require("../../../assets/images/nest.jpg") },
      { label: "Nose", image: require("../../../assets/images/nose.jpg") },
    ],
  },
  M: {
    sound: require("../../../assets/sound/m.m4a"),
    words: [
      { label: "Moon", image: require("../../../assets/images/moon.jpg") },
      { label: "Mango", image: require("../../../assets/images/mango.jpg") },
    ],
  },
  D: {
    sound: require("../../../assets/sound/d.m4a"),
    words: [
      { label: "Dog", image: require("../../../assets/images/dog.png") },
      { label: "Duck", image: require("../../../assets/images/duck.jpg") },
    ],
  },
};

export default function LetterActivitiesScreen() {
  const { letter } = useLocalSearchParams();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playLetterSound = async () => {
    if (!letter || !letterData[letter]) return;

    const { sound: soundFile } = letterData[letter];

    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing letter sound:", error);
    }
  };

  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const words = letterData[letter]?.words || [];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Letter: {letter}</Text>

      {/* Activity 1: Hear Letter Sound */}
      <Text style={styles.activityTitle}>🔊 Hear the Sound</Text>
      <Pressable style={styles.soundButton} onPress={playLetterSound}>
        <Text style={styles.soundButtonText}>▶️ Say "{letter}"</Text>
      </Pressable>

      {/* Activity 2: Tap Object to Hear Word */}
      <Text style={styles.activityTitle}>🧠 Tap Object to Hear Word</Text>
      <View style={styles.optionsRow}>
        {words.map((item, index) => (
          <Pressable
            key={index}
            style={styles.option}
            onPress={() => speakWord(item.label)}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.wordLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ✅ Next Button */}
      <Pressable
        style={styles.nextButton}
        onPress={() => {
          if (letter === "S") {
            router.push("/phonics_page/sound-matching_s");
          } else if (letter === "A") {
            router.push("phonics_page/sound-matching_a");
          } else if (letter === "T") {
            router.push("phonics_page/sound-matching_t");
          } else if (letter === "P") {
            router.push("phonics_page/sound-matching_p");
          } else if (letter === "I") {
            router.push("phonics_page/sound-matching_i");
          } else if (letter === "N") {
            router.push("phonics_page/sound-matching_n");
          } else if (letter === "M") {
            router.push("phonics_page/sound-matching_m");
          } else if (letter === "D") {
            router.push("phonics_page/sound-matching_d");
          } else {
            console.warn("No navigation defined for this letter");
          }
        }}
      >
        <Text style={styles.nextButtonText}>➡️ Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  soundButton: {
    backgroundColor: "#ffcc00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  soundButtonText: { fontSize: 18 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  option: {
    alignItems: "center",
    marginVertical: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  wordLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
