import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";

// Quiz Data
const quizData = [
  {
    type: "letter", // show letter
    question: "Which sound is this?",
    answer: "G",
    options: ["G", "O", "C", "K"],
    sound: require("../../assets/sound/g.m4a"),
  },
  {
    type: "image", // show image
    question: "Select the word with G sound",
    answer: "Goat",
    options: [
      { label: "Goat", image: require("../../assets/images/goat.jpg") },
      { label: "Sun", image: require("../../assets/images/sun.png") },
      { label: "Cat", image: require("../../assets/images/cat.png") },
    ],
    sound: require("../../assets/sound/g.m4a"),
  },
  {
    type: "sound", // play sound, pick correct letter
    question: "Which letter makes this sound?",
    answer: "O",
    options: ["G", "O", "C", "K"],
    sound: require("../../assets/sound/o.m4a"),
  },
];

export default function FlashcardDrill() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = quizData[currentIndex];

  useEffect(() => {
    // play sound when question loads
    if (currentQuestion?.sound) {
      playSound(currentQuestion.sound);
    }
  }, [currentIndex]);

  const playSound = async (soundFile: any) => {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  const checkAnswer = (selected: string) => {
    if (selected === currentQuestion.answer) {
      setScore((prev) => prev + 1);
      Alert.alert("✅ Correct!", `Score: ${score + 1}`);
    } else {
      setScore((prev) => Math.max(prev - 1, 0));
      Alert.alert("❌ Wrong!", `Score: ${Math.max(score - 1, 0)}`);
    }

    // next question or finish
    setTimeout(() => {
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        Alert.alert("🏁 Game Over", `Your final score: ${score}`);
        setCurrentIndex(0);
        setScore(0);
      }
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Flashcard Drill</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {/* Letter type */}
      {currentQuestion.type === "letter" && (
        <Text style={styles.flashLetter}>{currentQuestion.answer}</Text>
      )}

      {/* Image type */}
      {currentQuestion.type === "image" && (
        <Image
          source={currentQuestion.options[0].image}
          style={styles.flashImage}
        />
      )}

      {/* Options */}
      <View style={styles.options}>
        {currentQuestion.options.map((opt: any, idx) => (
          <Pressable
            key={idx}
            style={styles.option}
            onPress={() => checkAnswer(opt.label || opt)}
          >
            {typeof opt === "string" ? (
              <Text style={styles.optionText}>{opt}</Text>
            ) : (
              <>
                <Image source={opt.image} style={styles.optionImage} />
                <Text style={styles.optionText}>{opt.label}</Text>
              </>
            )}
          </Pressable>
        ))}
      </View>

      <Text style={styles.score}>⭐ Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  question: { fontSize: 20, textAlign: "center", marginBottom: 15 },
  flashLetter: { fontSize: 80, textAlign: "center", marginBottom: 20 },
  flashImage: { width: 150, height: 150, alignSelf: "center", marginBottom: 20 },
  options: { marginTop: 20 },
  option: {
    backgroundColor: "#d0f0fd",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  optionText: { fontSize: 20, fontWeight: "600" },
  optionImage: { width: 80, height: 80, marginBottom: 5 },
  score: { fontSize: 18, textAlign: "center", marginTop: 20, fontWeight: "600" },
});

