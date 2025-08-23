import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

const PhonicsSoundTrain = () => {
  // Word data organized by phases
  const wordData = {
    'Phase 1: s, a, t, p, i, n, m, d': {
      's': ['sat', 'sit', 'sun', 'sob', 'sip'],
      'a': ['at', 'am', 'an', 'as', 'ax'],
      't': ['tap', 'tip', 'top', 'tan', 'tin'],
      'p': ['pat', 'pit', 'pot', 'pin', 'pan'],
      'i': ['it', 'in', 'is', 'if', 'ill'],
      'n': ['nap', 'nip', 'net', 'not', 'nut'],
      'm': ['mat', 'map', 'man', 'mug', 'mud'],
      'd': ['dad', 'dig', 'dog', 'dot', 'dip']
    },
    'Phase 2: g, o, c, k, e, u, r, h, b, f, l': {
      'g': ['gap', 'get', 'gum', 'gun', 'gig'],
      'o': ['on', 'off', 'ox', 'ot', 'og'],
      'c': ['can', 'cap', 'cat', 'cot', 'cup'],
      'k': ['kid', 'kit', 'kin', 'keg', 'kiss'],
      'e': ['egg', 'elf', 'end', 'elm', 'elk'],
      'u': ['up', 'us', 'um', 'ug', 'un'],
      'r': ['rat', 'rip', 'rug', 'run', 'rob'],
      'h': ['hat', 'hit', 'hot', 'hug', 'hum'],
      'b': ['bat', 'bed', 'bug', 'bus', 'bag'],
      'f': ['fan', 'fin', 'fox', 'fun', 'fit'],
      'l': ['leg', 'lid', 'lip', 'log', 'lot']
    },
    'Phase 3: j, v, w, x, y, z': {
      'j': ['jam', 'jet', 'jog', 'jug', 'jab'],
      'v': ['van', 'vet', 'vat', 'vex', 'vim'],
      'w': ['wag', 'web', 'wet', 'win', 'wig'],
      'x': ['box', 'fox', 'six', 'wax', 'mix'],
      'y': ['yam', 'yap', 'yes', 'yet', 'yum'],
      'z': ['zap', 'zip', 'zig', 'zag', 'zoo']
    }
  };

  const [selectedWord, setSelectedWord] = useState(null);
  const [sound, setSound] = useState();
  const [currentPhase, setCurrentPhase] = useState('Phase 1: s, a, t, p, i, n, m, d');

  // Mapping of letters to their audio files
  const letterSounds = {
    'a': require('../../assets/sound/a.m4a'),
    'b': require('../../assets/sound/b.m4a'),
    'c': require('../../assets/sound/c.m4a'),
    'd': require('../../assets/sound/d.m4a'),
    'e': require('../../assets/sound/e.m4a'),
    'f': require('../../assets/sound/f.m4a'),
    'g': require('../../assets/sound/g.m4a'),
    'h': require('../../assets/sound/h.m4a'),
    'i': require('../../assets/sound/i.m4a'),
    'j': require('../../assets/sound/j.m4a'),
    'k': require('../../assets/sound/k.mp3'),
    'l': require('../../assets/sound/l.m4a'),
    'm': require('../../assets/sound/m.m4a'),
    'n': require('../../assets/sound/n.m4a'),
    'o': require('../../assets/sound/o.m4a'),
    'p': require('../../assets/sound/p.m4a'),
    'q': require('../../assets/sound/qu.m4a'),
    'r': require('../../assets/sound/r.m4a'),
    's': require('../../assets/sound/s.m4a'),
    't': require('../../assets/sound/t.m4a'),
    'u': require('../../assets/sound/u.m4a'),
    'v': require('../../assets/sound/v.m4a'),
    'w': require('../../assets/sound/w.m4a'),
    'x': require('../../assets/sound/x.m4a'),
    'y': require('../../assets/sound/y.m4a'),
    'z': require('../../assets/sound/z.m4a')
  };

  // Load and unload sound
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Function to play individual letter sound from audio file
  const playLetterSound = async (letter) => {
    try {
      // Stop any ongoing speech
      Speech.stop();
      
      // Get the sound file for the letter
      const soundFile = letterSounds[letter.toLowerCase()];
      
      if (soundFile) {
        // Unload any previous sound
        if (sound) {
          await sound.unloadAsync();
        }
        
        // Load and play the new sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          soundFile,
          { shouldPlay: true }
        );
        setSound(newSound);
        await newSound.playAsync();
      } else {
        // Fallback to speech if audio file not found
        Speech.speak(letter, {
          language: 'en',
          pitch: 1.2,
          rate: 0.8
        });
      }
    } catch (error) {
      console.error('Error playing letter sound:', error);
      // Fallback to speech if audio file fails
      Speech.speak(letter, {
        language: 'en',
        pitch: 1.2,
        rate: 0.8
      });
    }
  };

  // Function to play the blended word using Expo Speech
  const playWordSound = () => {
    if (!selectedWord) return;
    
    Speech.stop(); // Stop any ongoing speech
    Speech.speak(selectedWord, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9
    });
  };

  // Function to select a word and play its sound
  const selectWord = (word) => {
    setSelectedWord(word);
    Speech.stop();
    // Play word sound immediately
    Speech.speak(word, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9
    });
  };

  // Render phase selection buttons
  const renderPhaseSelector = () => {
    return Object.keys(wordData).map((phase) => (
      <TouchableOpacity
        key={phase}
        style={[
          styles.phaseButton,
          currentPhase === phase && styles.activePhaseButton
        ]}
        onPress={() => setCurrentPhase(phase)}
      >
        <Text style={[
          styles.phaseButtonText,
          currentPhase === phase && styles.activePhaseButtonText
        ]}>
          {phase}
        </Text>
      </TouchableOpacity>
    ));
  };

  // Render the word with clickable letters
  const renderWordLetters = () => {
    if (!selectedWord) {
      return (
        <View style={styles.placeholderContainer}>
          <Ionicons name="school-outline" size={60} color="#cbd5e1" />
          <Text style={styles.placeholderText}>
            Select a word from below to begin!
          </Text>
        </View>
      );
    }

    const letters = selectedWord.split('');

    return (
      <View style={styles.wordContainer}>
        <Text style={styles.wordTitle}>Selected Word:</Text>
        <View style={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.letterButton}
              onPress={() => playLetterSound(letter)}
            >
              <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.wordDisplay}>{selectedWord}</Text>
        
        <TouchableOpacity 
          style={styles.blendButton} 
          onPress={playWordSound}
        >
          <Ionicons name="play-circle" size={24} color="white" />
          <Text style={styles.blendButtonText}>
            Play Word Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render word selection buttons for the current phase
  const renderWordSelector = () => {
    const currentPhaseData = wordData[currentPhase];
    
    return Object.entries(currentPhaseData).map(([letter, words]) => (
      <View key={letter} style={styles.letterCategory}>
        <View style={styles.letterHeader}>
          <TouchableOpacity 
            style={styles.letterSoundButton}
            onPress={() => playLetterSound(letter)}
          >
            <Text style={styles.letterTitle}>{letter.toUpperCase()}</Text>
          </TouchableOpacity>
          <View style={styles.letterLine} />
        </View>
        <View style={styles.wordList}>
          {words.map((word) => (
            <TouchableOpacity
              key={word}
              style={[
                styles.wordButton,
                selectedWord === word && styles.selectedWordButton
              ]}
              onPress={() => selectWord(word)}
            >
              <Text
                style={[
                  styles.wordButtonText,
                  selectedWord === word && styles.selectedWordButtonText
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="volume-high" size={32} color="white" />
            <Text style={styles.title}>Phonics Sound Blending</Text>
            <Text style={styles.subtitle}>Structured Learning by Phases</Text>
          </View>
        </View>
        
        <View style={styles.phaseContainer}>
          <Text style={styles.phaseTitle}>Select Learning Phase:</Text>
          <View style={styles.phaseButtons}>
            {renderPhaseSelector()}
          </View>
        </View>
        
        <View style={styles.mainContent}>
          {renderWordLetters()}
        </View>
        
        <View style={styles.wordsContainer}>
          <Text style={styles.wordsTitle}>Words for {currentPhase.split(':')[0]}:</Text>
          {renderWordSelector()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#38bdf8',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    opacity: 0.9,
  },
  phaseContainer: {
    padding: 15,
    backgroundColor: '#dbeafe',
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    textAlign: 'center',
  },
  phaseButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  phaseButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#eff6ff',
    borderRadius: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  activePhaseButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8',
  },
  phaseButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 12,
  },
  activePhaseButtonText: {
    color: 'white',
  },
  mainContent: {
    alignItems: 'center',
    padding: 20,
    minHeight: 250,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  wordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 15,
  },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  letterButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef08a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    margin: 5,
  },
  letterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b45309',
  },
  wordDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0369a1',
    marginTop: 10,
    marginBottom: 20,
  },
  blendButton: {
    backgroundColor: '#f97316',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  wordsContainer: {
    padding: 20,
    backgroundColor: '#e0f2fe',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wordsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 20,
    textAlign: 'center',
  },
  letterCategory: {
    marginBottom: 25,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  letterSoundButton: {
    backgroundColor: '#bae6fd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  letterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  letterLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#bae6fd',
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#0ea5e9',
  },
  selectedWordButton: {
    backgroundColor: '#0ea5e9',
  },
  wordButtonText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  selectedWordButtonText: {
    color: 'white',
  },
});

export default PhonicsSoundTrain;