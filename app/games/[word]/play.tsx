import { useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

// Types
type WordData = {
  letters: string[];
  image: string;
  sound: string;
  color: string;
};

type WordKey = 'cat' | 'dog' | 'sun' | 'pen';

type WordSet = Record<WordKey, WordData>;

// Word Set
const wordSet: WordSet = {
  cat: {
    letters: ['C', 'A', 'T'],
    image: '🐱',
    sound: '/k/ /æ/ /t/',
    color: '#FFD700',
  },
  dog: {
    letters: ['D', 'O', 'G'],
    image: '🐶',
    sound: '/d/ /ɒ/ /g/',
    color: '#87CEEB',
  },
  sun: {
    letters: ['S', 'U', 'N'],
    image: '☀️',
    sound: '/s/ /ʌ/ /n/',
    color: '#FFA500',
  },
  pen: {
    letters: ['P', 'E', 'N'],
    image: '✏️',
    sound: '/p/ /ɛ/ /n/',
    color: '#98FB98',
  },
};

const CVCGridActivity = () => {
  const { word } = useLocalSearchParams();
  const [currentWord, setCurrentWord] = useState<WordKey>('cat');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [droppedLetters, setDroppedLetters] = useState<(string | null)[]>([null, null, null]);
  const [celebrate, setCelebrate] = useState(false);
  const [feedback, setFeedback] = useState('');
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    if (word && typeof word === 'string') {
      const lowerWord = word.toLowerCase() as WordKey;
      if (wordSet[lowerWord]) {
        setCurrentWord(lowerWord);
      }
    }
  }, [word]);

  useEffect(() => {
    const shuffled = [...wordSet[currentWord].letters].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
    setDroppedLetters([null, null, null]);
    setFeedback('');
  }, [currentWord]);

  const letterPositions = scrambledLetters.map(() => ({
    xy: new Animated.ValueXY(),
    scale: new Animated.Value(1),
  }));

  const panResponders = scrambledLetters.map((_, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(letterPositions[index].scale, {
          toValue: 1.2,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: letterPositions[index].xy.x, dy: letterPositions[index].xy.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(letterPositions[index].scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        const dropX = e.nativeEvent.pageX;
        const startX = (width - 240) / 2;
        const slotIndex = Math.floor((dropX - startX) / 80);

        if (slotIndex >= 0 && slotIndex < 3 && !droppedLetters[slotIndex]) {
          const newDropped = [...droppedLetters];
          newDropped[slotIndex] = scrambledLetters[index];
          setDroppedLetters(newDropped);

          const newScrambled = [...scrambledLetters];
          newScrambled[index] = '';
          setScrambledLetters(newScrambled);
        }

        Animated.spring(letterPositions[index].xy, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start(() => {
          checkCompletion();
        });
      },
    })
  );

 const checkCompletion = () => {
  // Only proceed if all slots are filled
  const allFilled = droppedLetters.every(letter => letter !== null);

  if (allFilled) {
    const isCorrect = droppedLetters.every(
      (letter, i) => letter === wordSet[currentWord].letters[i]
    );

    if (isCorrect) {
      setCelebrate(true);
      setFeedback('Great Job! ');
      Speech.speak(currentWord);
      confettiRef.current?.start();

      setTimeout(() => {
        setCelebrate(false);
        nextWord();
      }, 2000);
    } else {
      setFeedback('Try Again! ');
      Speech.speak('Try again');
    }
  }
};


  const nextWord = () => {
    const words: WordKey[] = Object.keys(wordSet) as WordKey[];
    const currentIndex = words.indexOf(currentWord);
    const nextIndex = (currentIndex + 1) % words.length;
    const nextWordKey = words[nextIndex];
    setCurrentWord(nextWordKey);
  };

  return (
    <View style={styles.container}>
      {/* Word Image */}
      <Text style={[styles.wordImage, { backgroundColor: wordSet[currentWord].color }]}>
        {wordSet[currentWord].image}
      </Text>

      {/* Drop Slots */}
      <View style={styles.slotsContainer}>
        {droppedLetters.map((letter, index) => (
          <View key={`slot-${index}`} style={styles.slot}>
            {letter && <Text style={[styles.letter, styles.droppedLetter]}>{letter}</Text>}
          </View>
        ))}
      </View>

      {/* Scrambled Letters */}
      <View style={styles.lettersContainer}>
        {scrambledLetters.map((letter, index) =>
          letter ? (
            <Animated.View
              key={`letter-${index}`}
              style={[
                styles.letterContainer,
                {
                  transform: [
                    ...letterPositions[index].xy.getTranslateTransform(),
                    { scale: letterPositions[index].scale },
                  ],
                  backgroundColor: wordSet[currentWord].color,
                },
              ]}
              {...panResponders[index].panHandlers}
            >
              <Text style={styles.letter}>{letter}</Text>
            </Animated.View>
          ) : null
        )}
      </View>

      {/* Feedback */}
      <Text style={styles.feedback}>{feedback}</Text>

      {/* Hear Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: wordSet[currentWord].color }]}
        onPress={() => Speech.speak(currentWord)}
      >
        <Text style={styles.buttonText}>Hear Word</Text>
      </TouchableOpacity>

      {/* Confetti */}
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        fadeOut={true}
        autoStart={false}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  wordImage: {
    fontSize: 100,
    width: 200,
    height: 200,
    textAlign: 'center',
    lineHeight: 200,
    borderRadius: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
  slotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  slot: {
    width: 80,
    height: 100,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  letterContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
  },
  letter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  droppedLetter: {
    fontSize: 42,
    color: '#4CAF50',
  },
  feedback: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 20,
    height: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CVCGridActivity;
