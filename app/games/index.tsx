import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Link } from 'expo-router';

const cvcWords: string[] = ["cat", "dog", "sun", "pen"];

const CVCGame = () => {
  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: 'en',
      pitch: 1.0,
      rate: 1.0,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap a word to hear it and learn more!</Text>
      {cvcWords.map((word, index) => (
        <Link
          key={`word-${index}`}
          href={{
            pathname: "/games/[word]",
            params: { word }
          }}
          asChild
        >
          <TouchableOpacity
            style={styles.wordButton}
            onPress={() => speakWord(word)}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wordButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CVCGame;