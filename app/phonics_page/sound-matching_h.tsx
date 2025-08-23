// app/phonics_page/BalloonGameE.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon";

const { width, height } = Dimensions.get("window");
const COLORS = ["#FF6F61", "#F06292", "#9575CD", "#4FC3F7", "#81C784", "#FFD54F"];

const sounds = {
  O: require("../../assets/sound/o.m4a"),
  E: require("../../assets/sound/e.m4a"),
  H: require("../../assets/sound/h.m4a"),
  L: require("../../assets/sound/l.m4a"),
};

export default function BalloonGameH() {
  const targetLetter = "H";
  const [balloons, setBalloons] = useState([
    { id: 1, text: "E" },
    { id: 2, text: "O" },
    { id: 3, text: "H" },
    { id: 4, text: "L" },
    { id: 5, text: "H" },
    { id: 6, text: "H" },
    { id: 7, text: "O" },
    { id: 8, text: "H" },
  ]);
  const [confetti, setConfetti] = useState(false);
  const [showGreat, setShowGreat] = useState(false);

  const animations = useRef(
    balloons.reduce((acc, b) => {
      acc[b.id] = {
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
      };
      return acc;
    }, {})
  ).current;

  useEffect(() => {
    Speech.speak(`Pop the letter ${targetLetter}`);
    return () => Speech.stop();
  }, []);

  useEffect(() => {
    balloons.forEach((b) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[b.id].translateY, {
            toValue: -height * 0.35,
            duration: 5000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animations[b.id].translateY, {
            toValue: -height * 0.25,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animations[b.id].translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [balloons]);

  const playSound = async (letter) => {
    try {
      const file = sounds[letter];
      if (!file) return;
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 800);
    } catch (e) {
      console.log("Sound error:", e);
    }
  };

  const popBalloon = (id, text) => {
    playSound(text);
    if (text === targetLetter) {
      Animated.parallel([
        Animated.timing(animations[id].scale, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(animations[id].opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== id));
      });
    } else {
      Speech.speak("Wrong!");
      Alert.alert("❌ Wrong", `${text} is not correct`);
    }
  };

  useEffect(() => {
    if (balloons.length === 0) return;
    const remaining = balloons.filter((b) => b.text === targetLetter);
    if (remaining.length === 0) {
      setConfetti(true);
      setShowGreat(true);
      Speech.speak("Great job!");
      setTimeout(() => {
        setShowGreat(false);
        router.push("/phonics_page/level2");
      }, 2500);
    }
  }, [balloons]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎈 Pop the Letter “{targetLetter}” 🎈</Text>
      <View style={styles.balloonContainer}>
        {balloons.map((balloon, index) => (
          <Animated.View
            key={balloon.id}
            style={{
              transform: [{ translateY: animations[balloon.id].translateY }, { scale: animations[balloon.id].scale }],
              opacity: animations[balloon.id].opacity,
            }}
          >
            <TouchableOpacity
              style={[styles.balloon, { backgroundColor: COLORS[index % COLORS.length] }]}
              onPress={() => popBalloon(balloon.id, balloon.text)}
              activeOpacity={0.8}
            >
              <Text style={styles.balloonText}>{balloon.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {confetti && <ConfettiCannon count={220} origin={{ x: width / 2, y: -20 }} fadeOut autoStart explosionSpeed={300} />}
      {showGreat && (
        <View style={styles.overlay}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>🎉 Great! 🎉</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E1F5FE", alignItems: "center", justifyContent: "center", paddingTop: 40 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#01579B" },
  balloonContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: "100%", paddingHorizontal: 10 },
  balloon: { width: width * 0.2, height: width * 0.25, borderRadius: width * 0.15, margin: 10, alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 5 },
  balloonText: { fontSize: 32, fontWeight: "bold", color: "white" },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.25)" },
  banner: { paddingVertical: 18, paddingHorizontal: 30, backgroundColor: "white", borderRadius: 16, elevation: 8 },
  bannerText: { fontSize: 26, fontWeight: "800", color: "#2E7D32" },
});
