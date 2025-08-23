import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image, Alert, Vibration } from "react-native";
import { Audio } from "expo-av";
import React, { useState, useEffect } from "react";
import * as Speech from "expo-speech";

const sQuestions = [
  {
    letter: "S",
    sound: require("../../assets/sound/s.m4a"),
    correctAnswers: [{ label: "Sun", image: require("../../assets/images/sun.png") }],
    options: [
      { label: "Sun", image: require("../../assets/images/sun.png") },
      { label: "Ball", image: require("../../assets/images/ball.jpg") },
      { label: "Cat", image: require("../../assets/images/cat.png") },
    ],
  },
  {
    letter: "S",
    sound: require("../../assets/sound/s.m4a"),
    correctAnswers: [{ label: "Snake", image: require("../../assets/images/snake.png") }],
    options: [
      { label: "Snake", image: require("../../assets/images/snake.png") },
      { label: "Dog", image: require("../../assets/images/dog.png") },
      { label: "Kite", image: require("../../assets/images/kite.jpg") },
    ],
  },
  {
    letter: "S",
    sound: require("../../assets/sound/s.m4a"),
    correctAnswers: [{ label: "Star", image: require("../../assets/images/star.png") }],
    options: [
      { label: "Star", image: require("../../assets/images/star.png") },
      { label: "Tree", image: require("../../assets/images/tree.png") },
      { label: "Car", image: require("../../assets/images/car.png") },
    ],
  },
];

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function SoundMatchingGameS() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [triesLeft, setTriesLeft] = useState(2);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    const randomized = shuffleArray(sQuestions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(randomized);
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      playLetterSound();
      setTriesLeft(2);
    }
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [questionIndex, currentQuestion]);

  const playLetterSound = async () => {
    if (!currentQuestion) return;
    try {
      const { sound: soundObj } = await Audio.Sound.createAsync(currentQuestion.sound);
      setSound(soundObj);
      await soundObj.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const speakWord = (word: string) => {
    Speech.speak(word, { language: "en-US", pitch: 1.0, rate: 0.9 });
  };

  const handleOptionPress = (selectedLabel: string) => {
    const isCorrect = currentQuestion.correctAnswers.some((ans: any) => ans.label === selectedLabel);

    if (isCorrect) {
      if (questionIndex + 1 < questions.length) {
        Alert.alert("✅ Correct!", "", [{ text: "Next", onPress: () => setQuestionIndex(questionIndex + 1) }]);
      } else {
        Speech.speak("Great job!", { language: "en-US", pitch: 1.0, rate: 0.9 });
        Alert.alert("🎉 Great job!", "", [{ text: "OK", onPress: () => router.push("/phonics_page/level1") }]);
      }
    } else {
      Vibration.vibrate(400);
      if (triesLeft > 1) {
        setTriesLeft(triesLeft - 1);
        Alert.alert("❌ Wrong!", `Tries left: ${triesLeft - 1}`);
      } else {
        if (questionIndex + 1 < questions.length) {
          Alert.alert("Out of tries!", "Moving to next question.", [
            { text: "Next", onPress: () => setQuestionIndex(questionIndex + 1) },
          ]);
        } else {
          Alert.alert("Out of tries!", "Let's move back.", [
            { text: "OK", onPress: () => router.push("/phonics_page/level1") },
          ]);
        }
      }
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sound Matching - Letter S</Text>
      <Text style={styles.tries}>Tries left: {triesLeft}</Text>

      <Pressable style={styles.soundButton} onPress={playLetterSound}>
        <Text style={styles.soundButtonText}>🔊 Play Letter Sound</Text>
      </Pressable>

      <View style={styles.optionsRow}>
        {currentQuestion.options.map((item, idx) => (
          <View key={idx} style={styles.option}>
            <Image source={item.image} style={styles.image} />
            <Pressable style={styles.micButton} onPress={() => speakWord(item.label)}>
              <Text style={styles.micText}>🎤 Hear Word</Text>
            </Pressable>
            <Pressable style={styles.selectButton} onPress={() => handleOptionPress(item.label)}>
              <Text style={styles.selectText}>Select</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  tries: { fontSize: 18, textAlign: "center", marginBottom: 15, color: "red" },
  soundButton: { backgroundColor: "#ffcc00", padding: 14, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  soundButtonText: { fontSize: 18, fontWeight: "bold" },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginTop: 10 },
  option: { alignItems: "center", marginVertical: 10, width: 120 },
  image: { width: 90, height: 90, borderRadius: 10, marginBottom: 8 },
  micButton: { backgroundColor: "#2196F3", padding: 6, borderRadius: 6, marginBottom: 6 },
  micText: { color: "#fff", fontSize: 14 },
  selectButton: { backgroundColor: "#4CAF50", padding: 6, borderRadius: 6 },
  selectText: { color: "#fff", fontSize: 14 },
});
