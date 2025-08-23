import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  Easing
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

// Shuffle function for arrays
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const PhonicsSoundTrain = () => {
  // Original quiz questions data
  const originalQuizData = [
    // Word recognition questions
    {
      type: 'word',
      question: "Listen to the word and select the correct one:",
      audio: "sat",
      options: ["sat", "mat", "cat", "rat"],
      correctAnswer: "sat"
    },
    {
      type: 'word',
      question: "Listen to the word and select the correct one:",
      audio: "dog",
      options: ["dog", "log", "fog", "bog"],
      correctAnswer: "dog"
    },
    {
      type: 'word',
      question: "Listen to the word and select the correct one:",
      audio: "pin",
      options: ["pin", "bin", "win", "tin"],
      correctAnswer: "pin"
    },
    {
      type: 'word',
      question: "Listen to the word and select the correct one:",
      audio: "cup",
      options: ["cup", "pup", "sup", "tup"],
      correctAnswer: "cup"
    },
    {
      type: 'word',
      question: "Listen to the word and select the correct one:",
      audio: "bed",
      options: ["bed", "red", "fed", "led"],
      correctAnswer: "bed"
    },
    
    // Letter recognition questions
    {
      type: 'letter',
      question: "What letter makes this sound?",
      audio: "s",
      options: ["s", "a", "t", "p"],
      correctAnswer: "s"
    },
    {
      type: 'letter',
      question: "What letter makes this sound?",
      audio: "m",
      options: ["m", "n", "d", "b"],
      correctAnswer: "m"
    },
    {
      type: 'letter',
      question: "What letter makes this sound?",
      audio: "f",
      options: ["f", "v", "th", "sh"],
      correctAnswer: "f"
    },
    {
      type: 'letter',
      question: "What letter makes this sound?",
      audio: "l",
      options: ["l", "r", "w", "y"],
      correctAnswer: "l"
    },
    {
      type: 'letter',
      question: "What letter makes this sound?",
      audio: "g",
      options: ["g", "j", "k", "c"],
      correctAnswer: "g"
    },
    
    // Sound recognition questions
    {
      type: 'sound',
      question: "What sound does this letter make?",
      letter: "b",
      options: ["buh", "puh", "duh", "guh"],
      correctAnswer: "buh"
    },
    {
      type: 'sound',
      question: "What sound does this letter make?",
      letter: "d",
      options: ["duh", "buh", "guh", "puh"],
      correctAnswer: "duh"
    },
    {
      type: 'sound',
      question: "What sound does this letter make?",
      letter: "h",
      options: ["huh", "fuh", "th", "sh"],
      correctAnswer: "huh"
    },
    {
      type: 'sound',
      question: "What sound does this letter make?",
      letter: "r",
      options: ["ruh", "wuh", "luh", "yuh"],
      correctAnswer: "ruh"
    },
    {
      type: 'sound',
      question: "What sound does this letter make?",
      letter: "v",
      options: ["vuh", "fuh", "th", "zh"],
      correctAnswer: "vuh"
    }
  ];

  // State for shuffled quiz data
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize and shuffle quiz data on component mount
  useEffect(() => {
    const initializeQuiz = () => {
      // Shuffle the questions
      const shuffledQuestions = shuffleArray(originalQuizData);
      
      // Shuffle options for each question
      const fullyShuffledQuestions = shuffledQuestions.map(question => {
        return {
          ...question,
          options: shuffleArray(question.options)
        };
      });
      
      setQuizData(fullyShuffledQuestions);
    };

    initializeQuiz();
  }, []);

  // Load and unload sound
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Play audio for the current question
  const playQuestionAudio = async () => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      Speech.stop();
      
      const currentQuestion = quizData[currentQuestionIndex];
      
      if (currentQuestion.type === 'word' || currentQuestion.type === 'letter') {
        Speech.speak(currentQuestion.audio, {
          language: 'en',
          pitch: 1.0,
          rate: 0.8
        });
      } else if (currentQuestion.type === 'sound') {
        Speech.speak(currentQuestion.letter, {
          language: 'en',
          pitch: 1.0,
          rate: 0.8
        });
      }
      
      // Reset playing state after a delay
      setTimeout(() => setIsPlaying(false), 1500);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  // Play option audio
  const playOptionAudio = async (option) => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      Speech.stop();
      
      Speech.speak(option, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8
      });
      
      // Reset playing state after a delay
      setTimeout(() => setIsPlaying(false), 1500);
    } catch (error) {
      console.error('Error playing option audio:', error);
      setIsPlaying(false);
    }
  };

  // Handle answer selection
  const handleAnswer = (selectedOption) => {
    const currentQuestion = quizData[currentQuestionIndex];
    
    if (selectedOption === currentQuestion.correctAnswer) {
      // Correct answer
      setScore(score + 1);
      setShowResult(true);
      // Animate correct selection
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ]).start();
      
      setTimeout(() => {
        setShowResult(false);
        nextQuestion();
      }, 1500);
    } else {
      // Wrong answer
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        nextQuestion();
      }, 1500);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      setQuizFinished(true);
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    // Reshuffle questions and options
    const shuffledQuestions = shuffleArray(originalQuizData);
    const fullyShuffledQuestions = shuffledQuestions.map(question => {
      return {
        ...question,
        options: shuffleArray(question.options)
      };
    });
    
    setQuizData(fullyShuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setShowResult(false);
  };

  // Render quiz screen
  const renderQuiz = () => {
    if (quizFinished) {
      return (
        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>
            Your score: {score} / {quizData.length}
          </Text>
          <Text style={styles.scorePercentage}>
            {Math.round((score / quizData.length) * 100)}%
          </Text>
          
          <View style={styles.quizResult}>
            {score === quizData.length ? (
              <Ionicons name="trophy" size={60} color="#f59e0b" />
            ) : score >= quizData.length / 2 ? (
              <Ionicons name="happy" size={60} color="#22c55e" />
            ) : (
              <Ionicons name="sad" size={60} color="#ef4444" />
            )}
          </View>
          
          <TouchableOpacity style={styles.quizButton} onPress={restartQuiz}>
            <Text style={styles.quizButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Show loading if quiz data isn't ready yet
    if (quizData.length === 0) {
      return (
        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>Loading Quiz...</Text>
        </View>
      );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    
    return (
      <View style={styles.quizContainer}>
        <Text style={styles.quizTitle}>Phonics Quiz</Text>
        <Text style={styles.quizProgress}>
          Question {currentQuestionIndex + 1} of {quizData.length}
        </Text>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {currentQuestion.type === 'sound' && (
            <View style={styles.letterContainer}>
              <Text style={styles.letterDisplay}>{currentQuestion.letter.toUpperCase()}</Text>
              <TouchableOpacity 
                style={styles.playLetterButton}
                onPress={playQuestionAudio}
                disabled={isPlaying}
              >
                <Ionicons 
                  name="volume-high" 
                  size={24} 
                  color={isPlaying ? "#9ca3af" : "#3b82f6"} 
                />
              </TouchableOpacity>
            </View>
          )}
          
          {currentQuestion.type !== 'sound' && (
            <TouchableOpacity 
              style={[styles.playQuestionButton, isPlaying && styles.disabledButton]}
              onPress={playQuestionAudio}
              disabled={isPlaying}
            >
              <Ionicons 
                name="volume-high" 
                size={32} 
                color={isPlaying ? "#9ca3af" : "#3b82f6"} 
              />
              <Text style={[styles.playQuestionText, isPlaying && styles.disabledText]}>
                Play Audio
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <Animated.View key={index} style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  showResult && option === currentQuestion.correctAnswer && styles.correctOption,
                  showResult && option !== currentQuestion.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => handleAnswer(option)}
                disabled={showResult}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>{option}</Text>
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      playOptionAudio(option);
                    }}
                    disabled={isPlaying}
                  >
                    <Ionicons 
                      name="volume-medium-outline" 
                      size={20} 
                      color={isPlaying ? "#9ca3af" : "#6b7280"} 
                    />
                  </TouchableOpacity>
                </View>
                
                {showResult && option === currentQuestion.correctAnswer && (
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" style={styles.resultIcon} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        {showResult && (
          <Text style={[
            styles.resultText,
            { color: '#22c55e' }
          ]}>
            Correct! 🎉
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderQuiz()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Quiz Styles
  quizContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    minHeight: '100%'
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  quizProgress: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 30,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  questionText: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 15,
    textAlign: 'center',
  },
  letterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  letterDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 10,
  },
  playLetterButton: {
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 20,
  },
  playQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
  },
  disabledText: {
    color: '#9ca3af',
  },
  playQuestionText: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: '600',
    marginLeft: 10,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  incorrectOption: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginRight: 10,
  },
  resultIcon: {
    marginLeft: 10,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 30,
  },
  quizResult: {
    marginBottom: 30,
  },
  quizButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PhonicsSoundTrain;