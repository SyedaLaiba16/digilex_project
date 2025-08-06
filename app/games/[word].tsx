import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WordDetail() {
  const { word } = useLocalSearchParams();
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const router = useRouter(); // for navigation

  // Phonetic mapping for each letter
  const phoneticMap: { [key: string]: string } = {
  
  a: 'aae',
  b: 'buh',
  c: 'ke',
  d: 'duh',
  e: 'e',
  f: 'fuh',
  g: 'ga',
  h: 'huh',
  i: 'ih',
  j: 'juh',
  k: 'kuh',
  l: 'luh',
  m: 'muh',
  n: 'n',
  o: 'aw',
  p: 'peh',
  q: 'kwuh',
  r: 'ruh',
  s: 'sah',
  t: 't',
  u: 'uh',      // ← this is short 'u' like in "sun"
  v: 'vuh',
  w: 'wuh',
  x: 'ks',
  y: 'yuh',
  z: 'zuh'
};



  const speakLetter = (letter: string, index: number) => {
    const sound = phoneticMap[letter.toLowerCase()] || letter; // Get phonetic sound or the letter itself
    setActiveLetter(index);
    Speech.speak(sound, {
      language: 'en',
      pitch: 1.0,
      rate: 0.7,
      onDone: () => {
        setActiveLetter(null);
        if (index === (word as string).length - 1) {
          setTimeout(() => {
            Speech.speak(word as string);
          }, 500);
        }
      }
    });
  };

  const wordDetails = {
    cat: {
      title: 'C - A - T',
      subtitle: '/k/ /æ/ /t/',
      description: 'A small domesticated carnivorous mammal with soft fur.'
    },
    dog: {
      title: 'D - O - G',
      subtitle: '/d/ /ɒ/ /g/',
      description: 'A domesticated carnivorous mammal that typically has a long snout.'
    },
    sun: {
      title: 'S - U - N',
      subtitle: '/s/ /ʌ/ /n/',
      description: 'The star around which the earth orbits.'
    },
    pen: {
      title: 'P - E - N',
      subtitle: '/p/ /ɛ/ /n/',
      description: 'An instrument for writing or drawing with ink.'
    }
  };

  const detail = wordDetails[word as keyof typeof wordDetails] || {
    title: word as string,
    subtitle: '',
    description: 'Word details coming soon!'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.lettersContainer}>
        {(word as string).split('').map((letter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => speakLetter(letter, index)}
          >
            <Text style={[
              styles.letter,
              activeLetter === index && styles.activeLetter
            ]}>
              {letter}
              {index < (word as string).length - 1 ? ' - ' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </Text>
      
      <Text style={styles.subtitle}>{detail.subtitle}</Text>
      <Text style={styles.description}>{detail.description}</Text>
      
      <TouchableOpacity
        style={styles.speakButton}
        onPress={() => {
          (word as string).split('').forEach((letter, i) => {
            setTimeout(() => speakLetter(letter, i), i * 1000);
          });
        }}
      >
        <Text style={styles.speakButtonText}>Spell Word</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.speakButton, { backgroundColor: '#2196F3' }]}
        onPress={() => {
          if (typeof word === 'string') {
            // Navigate to app/games/[word]/play
            router.push({
              pathname: '/games/[word]/play',
              params: { word },
            });
          }
        }}
      >
        <Text style={styles.speakButtonText}>Play</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  lettersContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  letter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 5,
  },
  activeLetter: {
    color: '#FF5722',
    transform: [{ scale: 1.2 }],
  },
  subtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    color: '#444',
    marginBottom: 30,
  },
  speakButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 10,
  },
  speakButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
