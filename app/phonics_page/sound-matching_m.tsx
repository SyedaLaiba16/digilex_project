import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image, Alert, Vibration } from "react-native";
import { Audio } from "expo-av";
import React, { useState, useEffect } from "react";
import * as Speech from "expo-speech";

// All questions for letter M
const mQuestions = [
  {
    letter: "M",
    sound: require("../../assets/sound/m.m4a"), // 👈 Make sure this file exists
    correctAnswers: [
      { label: "Moon", image: require("../../assets/images/moon.jpg") },
    ],
    options: [
      { label: "Moon", image: require("../../assets/images/moon.jpg") },
      { label: "Dog", image: require("../../assets/images/dog.png") },
      { label: "Car", image: require("../../assets/images/car.png") },
    ],
  },
  {
    letter: "M",
    sound: require("../../assets/sound/m.m4a"),
    correctAnswers: [
      { label: "Milk", image: require("../../assets/images/milk.jpg") },
    ],
    options: [
      { label: "Milk", image: require("../../assets/images/milk.jpg") },
      { label: "Fish", image: require("../../assets/images/fish.jpg") },
      { label: "Star", image: require("../../assets/images/star.png") },
    ],
  },
  {
    letter: "M",
    sound: require("../../assets/sound/m.m4a"),
    correctAnswers: [
      { label: "Monkey", image: require("../../assets/images/monkey.jpg") },
    ],
    options: [
      { label: "Monkey", image: require("../../assets/images/monkey.jpg") },
      { label: "Apple", image: require("../../assets/images/apple.png") },
      { label: "Book", image: require("../../assets/images/book.jpg") },
    ],
  },
  {
    letter: "M",
    sound: require("../../assets/sound/m.m4a"),
    correctAnswers: [
      { label: "Mango", image: require("../../assets/images/mango.jpg") },
    ],
    options: [
      { label: "Mango", image: require("../../assets/images/mango.jpg") },
      { label: "Chair", image: require("../../assets/images/chair.jpg") },
      { label: "Tree", image: require("../../assets/images/tree.png") },
    ],
  },
];

// Shuffle helper
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function SoundMatchingGameM() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    const randomized = shuffleArray(mQuestions).map(q => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(randomized);
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      playLetterSound();
      setWrongAttempt(false);
    }
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [questionIndex, currentQuestion]);

  // Play letter sound
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

  // Speak picture name
  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const handleOptionPress = (selectedLabel: string) => {
    const isCorrect = currentQuestion.correctAnswers.some(
      (ans: any) => ans.label === selectedLabel
    );

    if (isCorrect) {
      setScore(score + 1);
      if (questionIndex + 1 < questions.length) {
        Alert.alert("✅ Correct!", "", [
          { text: "Next", onPress: () => setQuestionIndex(questionIndex + 1) },
        ]);
      } else {
        Alert.alert(`🎯 Game Over! Your Score: ${score + 1}`, "", [
          { text: "OK", onPress: () => router.push("/") },
        ]);
      }
    } else {
      Vibration.vibrate(500);
      if (!wrongAttempt) {
        setWrongAttempt(true);
        Alert.alert("❌ Try Again!");
      } else {
        if (questionIndex + 1 < questions.length) {
          Alert.alert("Moving to next question...", "", [
            { text: "Next", onPress: () => setQuestionIndex(questionIndex + 1) },
          ]);
        } else {
          Alert.alert(`🎯 Game Over! Your Score: ${score}`, "", [
            { text: "OK", onPress: () => router.push("/") },
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
      <Text style={styles.heading}>Sound Matching - Letter M</Text>
      <Text style={styles.score}>Score: {score} / {questions.length}</Text>

      {/* Play Sound Button */}
      <Pressable style={styles.soundButton} onPress={playLetterSound}>
        <Text style={styles.soundButtonText}>🔊 Play Letter Sound</Text>
      </Pressable>

      {/* Options */}
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
  score: { fontSize: 18, textAlign: "center", marginBottom: 15 },
  soundButton: {
    backgroundColor: "#ffcc00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  soundButtonText: { fontSize: 18, fontWeight: "bold" },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  option: {
    alignItems: "center",
    marginVertical: 10,
    width: 120,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
  micButton: {
    backgroundColor: "#2196F3",
    padding: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  micText: { color: "#fff", fontSize: 14 },
  selectButton: {
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 6,
  },
  selectText: { color: "#fff", fontSize: 14 },
});
