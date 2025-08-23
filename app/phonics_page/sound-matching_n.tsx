// app/phonics_page/FlashcardDrill_N.tsx
import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import Voice from "@react-native-voice/voice";

// Quiz Data for Letter N
const quizData = [
  {
    type: "sound", // show only speaker
    question: "Which sound is this?",
    answer: "N",
    options: ["N", "B", "H", "K"],
    sound: require("../../assets/sound/n.m4a"),
  },
  {
    type: "image", // image activity
    question: "Select the word with N sound",
    answer: "Net",
    options: [
      { label: "Net" },
      { label: "Sun" },
      { label: "Cat" },
      { label: "Jug" },
    ],
    sound: require("../../assets/sound/n.m4a"),
  },
  {
    type: "voice", // voice input activity
    question: "Say this letter sound aloud",
    answer: "N",
    options: [],
    sound: require("../../assets/sound/n.m4a"),
  },
];

export default function FlashcardDrillN() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tries, setTries] = useState(2);
  const [recognizedText, setRecognizedText] = useState("");

  const currentQuestion = quizData[currentIndex];

  // Voice setup
  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setRecognizedText(event.value[0].toUpperCase());
        checkVoiceAnswer(event.value[0].toUpperCase());
      }
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (currentQuestion?.sound && currentQuestion.type !== "voice") {
      playSound(currentQuestion.sound);
    }
    setTries(2);
    setRecognizedText("");
  }, [currentIndex]);

  // ✅ Sound Player
  const playSound = async (soundFile: any) => {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  const checkAnswer = (selected: string) => {
    if (selected === currentQuestion.answer) {
      Alert.alert("✅ Correct!");
      goNext();
    } else {
      if (tries > 1) {
        setTries(tries - 1);
        Alert.alert("❌ Try Again", `Tries left: ${tries - 1}`);
      } else {
        Alert.alert("❌ Wrong!", "No tries left");
        goNext();
      }
    }
  };

  const checkVoiceAnswer = (spoken: string) => {
    if (spoken.includes(currentQuestion.answer)) {
      Alert.alert("✅ Correct!", `You said: ${spoken}`);
      goNext();
    } else {
      if (tries > 1) {
        setTries(tries - 1);
        Alert.alert("❌ Try Again", `You said: ${spoken}`);
      } else {
        Alert.alert("❌ Wrong!", `Final attempt was: ${spoken}`);
        goNext();
      }
    }
  };

    const goNext = () => {
      setTimeout(() => {
        if (currentIndex < quizData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          router.push("/phonics_page/level1");
        }
      }, 800);
    };

  const startListening = async () => {
    try {
      setRecognizedText("");
      await Voice.stop();
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {/* Sound activity */}
      {currentQuestion.type === "sound" && (
        <Pressable onPress={() => playSound(currentQuestion.sound)}>
          <Image
            source={require("../../assets/images/speaker.jpg")}
            style={{ width: 80, height: 80, alignSelf: "center", margin: 20 }}
          />
        </Pressable>
      )}

      {/* Voice activity */}
      {currentQuestion.type === "voice" && (
        <View>
          <Pressable onPress={() => playSound(currentQuestion.sound)}>
            <Text style={styles.flashLetter}>{currentQuestion.answer}</Text>
          </Pressable>
          {recognizedText ? (
            <Text style={styles.voiceResult}>You said: {recognizedText}</Text>
          ) : null}
        </View>
      )}

      {/* Options */}
      {currentQuestion.type !== "voice" && (
        <View style={styles.options}>
          {currentQuestion.options.map((opt: any, idx) => (
            <Pressable
              key={idx}
              style={styles.option}
              onPress={() => checkAnswer(opt.label || opt)}
            >
              <Text style={styles.optionText}>
                {typeof opt === "string" ? opt : opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Mic button */}
      {currentQuestion.type === "voice" && (
        <Pressable style={styles.micButton} onPress={startListening}>
          <Text style={{ fontSize: 18, color: "#fff" }}>🎤 Speak Now</Text>
        </Pressable>
      )}

      <Text style={styles.score}>🔄 Tries Left: {tries}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  question: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  flashLetter: {
    fontSize: 80,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
    fontWeight: "bold",
  },
  options: { marginTop: 20 },
  option: {
    backgroundColor: "#d0f0fd",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  optionText: { fontSize: 20, fontWeight: "600" },
  score: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  micButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  voiceResult: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});
