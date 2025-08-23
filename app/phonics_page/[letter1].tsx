import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import React, { useState } from "react";

const letterData = {
  S: {
    sound: require("../../assets/sound/s.m4a"),
    words: [
      { label: "Sun", image: require("../../assets/images/sun.png") },
      { label: "Snake", image: require("../../assets/images/snake.png") },
    ],
  },
  A: {
    sound: require("../../assets/sound/a.m4a"),
    words: [
      { label: "Ant", image: require("../../assets/images/ant.png") },
      { label: "Apple", image: require("../../assets/images/apple.jpg") },
    ],
  },
  T: {
    sound: require("../../assets/sound/t.m4a"),
    words: [
      { label: "Tree", image: require("../../assets/images/tree.png") },
      { label: "Train", image: require("../../assets/images/train.png") },
    ],
  },
  P: {
    sound: require("../../assets/sound/p.m4a"),
    words: [
      { label: "Pen", image: require("../../assets/images/pen.png") },
      { label: "Pin", image: require("../../assets/images/pin.png") },
    ],
  },
  I: {
    sound: require("../../assets/sound/i.m4a"),
    words: [
      { label: "Igloo", image: require("../../assets/images/igloo.jpg") },
      { label: "Insect", image: require("../../assets/images/insect.jpg") },
    ],
  },
  N: {
    sound: require("../../assets/sound/n.m4a"),
    words: [
      { label: "Nest", image: require("../../assets/images/nest.jpg") },
      { label: "Nose", image: require("../../assets/images/nose.jpg") },
    ],
  },
  M: {
    sound: require("../../assets/sound/m.m4a"),
    words: [
      { label: "Moon", image: require("../../assets/images/moon.jpg") },
      { label: "Mango", image: require("../../assets/images/mango.jpg") },
    ],
  },
  D: {
    sound: require("../../assets/sound/d.m4a"),
    words: [
      { label: "Dog", image: require("../../assets/images/dog.png") },
      { label: "Duck", image: require("../../assets/images/duck.jpg") },
    ],
  },
  // Naye letters add kiye gaye hain
  G: {
    sound: require("../../assets/sound/g.m4a"),
    words: [
      { label: "Goat", image: require("../../assets/images/goat.jpg") },
      { label: "Grapes", image: require("../../assets/images/grapes.jpg") },
    ],
  },
  O: {
    sound: require("../../assets/sound/o.m4a"),
    words: [
      { label: "Orange", image: require("../../assets/images/orange.jpg") },
      { label: "Owl", image: require("../../assets/images/owl1.jpg") },
    ],
  },
  C: {
    sound: require("../../assets/sound/c.m4a"),
    words: [
      { label: "Cat", image: require("../../assets/images/cat.png") },
      { label: "Car", image: require("../../assets/images/car.png") },
    ],
  },
  K: {
    sound: require("../../assets/sound/k.mp3"),
    words: [
      { label: "Kite", image: require("../../assets/images/kite.jpg") },
      { label: "Key", image: require("../../assets/images/key.jpg") },
    ],
  },
  E: {
    sound: require("../../assets/sound/e.m4a"),
    words: [
      { label: "Egg", image: require("../../assets/images/egg.jpg") },
      { label: "Elephant", image: require("../../assets/images/elephant.jpg") },
    ],
  },
  U: {
    sound: require("../../assets/sound/u.m4a"),
    words: [
      { label: "Umbrella", image: require("../../assets/images/umbrella.jpg") },
      { label: "Up", image: require("../../assets/images/up.jpg") },
    ],
  },
  R: {
    sound: require("../../assets/sound/r.m4a"),
    words: [
      { label: "Rabbit", image: require("../../assets/images/rabbit.jpg") },
      { label: "Ring", image: require("../../assets/images/ring.jpg") },
    ],
  },
  H: {
    sound: require("../../assets/sound/h.m4a"),
    words: [
      { label: "Hat", image: require("../../assets/images/hat.jpg") },
      { label: "Hen", image: require("../../assets/images/hen.jpg") },
    ],
  },
  B: {
    sound: require("../../assets/sound/b.m4a"),
    words: [
      { label: "Ball", image: require("../../assets/images/ball.jpg") },
      { label: "Bat", image: require("../../assets/images/bat.png") },
    ],
  },
  F: {
    sound: require("../../assets/sound/f.m4a"),
    words: [
      { label: "Fish", image: require("../../assets/images/fish.jpg") },
      { label: "Fan", image: require("../../assets/images/fan.png") },
    ],
  },
  L: {
    sound: require("../../assets/sound/l.m4a"),
    words: [
      { label: "Lion", image: require("../../assets/images/lion.jpg") },
      { label: "Leaf", image: require("../../assets/images/leaf.jpg") },
    ],
  },
  // Aur letters add kar sakte hain yahan
  J: {
    sound: require("../../assets/sound/j.m4a"),
    words: [
      { label: "Jeep", image: require("../../assets/images/jeep.png") },
      { label: "Jug", image: require("../../assets/images/jug.jpg") },
    ],
  },
  V: {
    sound: require("../../assets/sound/v.m4a"),
    words: [
      { label: "Vegatables", image: require("../../assets/images/vegetables.jpg") },
      { label: "Vase", image: require("../../assets/images/vase.png") },
    ],
  },
  W: {
    sound: require("../../assets/sound/w.m4a"),
    words: [
      { label: "Watch", image: require("../../assets/images/watch.png") },
      { label: "Window", image: require("../../assets/images/window.jpg") },
    ],
  },
  X: {
    sound: require("../../assets/sound/x.m4a"),
    words: [
      { label: "Xylophone", image: require("../../assets/images/Xylophone.jpg") },
      { label: "X-ray", image: require("../../assets/images/x-ray.jpg") },
    ],
  },
  Y: {
    sound: require("../../assets/sound/y.m4a"),
    words: [
      { label: "Yak", image: require("../../assets/images/yak.jpg") },
      { label: "Yoyo", image: require("../../assets/images/yoyo.jpg") },
    ],
  },
  Z: {
    sound: require("../../assets/sound/z.m4a"),
    words: [
      { label: "Zebra", image: require("../../assets/images/zebra.jpg") },
      { label: "Zip", image: require("../../assets/images/zip.jpg") },
    ],
  },
  Q: {
    sound: require("../../assets/sound/qu.m4a"),
    words: [
      { label: "Queen", image: require("../../assets/images/queen.png") },
      { label: "Queue", image: require("../../assets/images/queue.png") },
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
          // Sabhi letters ke liye navigation add kiya gaya hai
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
          } else if (letter === "G") {
            router.push("phonics_page/sound-matching_g");
          } else if (letter === "O") {
            router.push("phonics_page/sound-matching_o");
          } else if (letter === "C") {
            router.push("phonics_page/sound-matching_c");
          } else if (letter === "K") {
            router.push("phonics_page/sound-matching_k");
          } else if (letter === "E") {
            router.push("phonics_page/sound-matching_e");
          } else if (letter === "U") {
            router.push("phonics_page/sound-matching_u");
          } else if (letter === "R") {
            router.push("phonics_page/sound-matching_r");
          } else if (letter === "H") {
            router.push("phonics_page/sound-matching_h");
          } else if (letter === "B") {
            router.push("phonics_page/sound-matching_b");
          } else if (letter === "F") {
            router.push("phonics_page/sound-matching_f");
          } else if (letter === "L") {
            router.push("phonics_page/sound-matching_l");
          } else if (letter === "J") {
            router.push("phonics_page/sound-matching_j");
          } else if (letter === "V") {
            router.push("phonics_page/sound-matching_v");
          } else if (letter === "W") {
            router.push("phonics_page/sound-matching_w");
          } else if (letter === "X") {
            router.push("phonics_page/sound-matching_x");
          } else if (letter === "Y") {
            router.push("phonics_page/sound-matching_y");
          } else if (letter === "Z") {
            router.push("phonics_page/sound-matching_z");
          } else if (letter === "Q") {
            router.push("phonics_page/sound-matching_q");
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