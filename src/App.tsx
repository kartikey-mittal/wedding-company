import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import catToePng from './assets/cattoe.png';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What sound does a cat make?",
    options: ["Bhau-Bhau", "Meow-Meow", "Oink-Oink"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7"],
    correctAnswer: 2
  }
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setAnimatedScore(0);
  };

  // Counter animation effect - smooth counting
  useEffect(() => {
    if (showResults) {
      const targetScore = calculateScore();
      const duration = 3500; // 3.5 seconds - slower for smooth effect
      const frameRate = 60; // 60 fps for smooth animation
      const totalFrames = Math.round((duration / 1000) * frameRate);
      let currentFrame = 0;
      
      const timer = setInterval(() => {
        currentFrame++;
        if (currentFrame >= totalFrames) {
          setAnimatedScore(targetScore);
          clearInterval(timer);
        } else {
          // Smooth easing: cubic ease-out for natural deceleration
          const progress = currentFrame / totalFrames;
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(targetScore * easeOutCubic);
          setAnimatedScore(currentValue);
        }
      }, 1000 / frameRate);
      
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  return (
    <div className="app-container">
      {/* Outer rounded container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="outer-container"
      >
        {/* Inner white card */}
        <div className="inner-card">
          <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="quiz-content"
            >
              {/* Title Section */}
              <div className="title-section">
                <h1 className="main-title">Test Your Knowledge</h1>
                <p className="subtitle">Answer all questions to see your results</p>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                {questions.map((_, index) => (
                  <div 
                    key={index}
                    className={`progress-bar ${index <= currentQuestion ? 'active' : 'inactive'}`}
                  />
                ))}
              </div>

              {/* Question Box */}
              <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="question-box"
                >
                  <p className="question-text">
                    {currentQuestion + 1}.  {questions[currentQuestion].question}
                  </p>
                </motion.div>

                {/* Options */}
                <div className="options-container">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handleOptionSelect(index)}
                      className={`option-button ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="nav-arrows">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    className={`nav-button ${currentQuestion === 0 ? 'disabled' : ''}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: selectedAnswers[currentQuestion] !== null ? 1.05 : 1 }}
                    whileTap={{ scale: selectedAnswers[currentQuestion] !== null ? 0.95 : 1 }}
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === null}
                    className={`nav-button ${selectedAnswers[currentQuestion] === null ? 'disabled' : 'active-next'}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </motion.button>
                </div>

              {/* Cat Paw Mascot */}
              <div className="mascot-container">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mascot-wrapper"
                >
                  <div className="speech-bubble">
                    <span className="speech-text">Best of Luck!</span>
                    <div className="speech-pointer"></div>
                  </div>
                  <img src={catToePng} alt="Cat Paw" className="cat-paw-image" />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="results-content"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="keep-learning-badge"
              >
                <span>Keep Learning!</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="score-title"
              >
                Your Final score is
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
                className="score-display"
              >
                <motion.span 
                  key={animatedScore}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.05, ease: "easeOut" }}
                  className="score-number"
                >
                  {animatedScore}
                </motion.span>
                <span className="score-percent">%</span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(58, 122, 138, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestart}
                className="restart-button"
              >
                Start Again
              </motion.button>

              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                href="https://kartikey.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-credit"
              >
                Developed by KARTIKEY MITTAL
              </motion.a>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
