import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiClock, FiCheck, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { useColors } from '../context/ColorContext';

// Konfiguracja axios
axios.defaults.baseURL = 'http://localhost:5000';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 90px;
`;

const QuizCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.primary}10;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.primary}10;
`;

const Progress = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.timeLeft < 30 ? '#dc3545' : props.theme.primary};
`;

const QuestionCard = styled.div`
  margin-bottom: 32px;
`;

const QuestionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${props => props.theme.text};
  line-height: 1.5;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionButton = styled.button`
  padding: 16px 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}05;
    transform: translateY(-2px);
  }

  &.selected {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }

  &.correct {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.1);
  }

  &.incorrect {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.primary}10;
`;

const NavButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &.primary {
    background: ${props => props.theme.gradient};
    color: white;
    box-shadow: 0 2px 8px ${props => props.theme.primary}30;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props => props.theme.primary}50;
    }
  }

  &.secondary {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    border: 2px solid #e9ecef;

    &:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const FinishButton = styled.button`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.primary}50;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textLight};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
  font-size: 1.1rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}05;
    transform: translateY(-2px);
  }

  &.selected {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${props => props.theme.primary};
  }
`;

const QuizTaker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, updateKey } = useTranslation();
  const { colors } = useColors();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id, updateKey]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/quizzes/${id}`);
      const quizData = response.data;
      setQuiz(quizData);
      setTimeLeft(Number(quizData.timeLimit) || 300); // 5 minut domyślnie
      setError(null);
    } catch (err) {
      setError(t('Nie znaleziono quizu.'));
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    const currentQuestion = quiz.questions.find(q => q.id === questionId);
    
    if (currentQuestion.type === 'single') {
      // Pojedynczy wybór - zastąp poprzednią odpowiedź
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    } else {
      // Wielokrotny wybór - dodaj/usuń z listy
      setAnswers(prev => {
        const currentAnswers = prev[questionId] || [];
        const isSelected = currentAnswers.includes(optionId);
        
        if (isSelected) {
          // Usuń odpowiedź
          return {
            ...prev,
            [questionId]: currentAnswers.filter(a => a !== optionId)
          };
        } else {
          // Dodaj odpowiedź
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionId]
          };
        }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!user) {
      alert(t('Musisz być zalogowany, aby zapisać wynik.'));
      return;
    }

    try {
      const score = calculateScore();
      const result = {
        quizId: quiz.id,
        score: score.score,
        percentage: score.percentage,
        timeSpent: (quiz.timeLimit || 300) - timeLeft,
        answers: answers
      };

      await axios.post('/api/results', result, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      navigate(`/results/${quiz.id}`, { 
        state: { 
          score: score.score, 
          totalQuestions: quiz.questions.length,
          timeTaken: result.timeSpent
        } 
      });
    } catch (err) {
      console.error('Error saving result:', err);
      alert(t('Błąd podczas zapisywania wyniku.'));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      
      if (userAnswer) {
        if (question.type === 'single' && question.correctAnswer) {
          // Porównaj ID wybranej opcji z ID poprawnej odpowiedzi
          if (userAnswer === question.correctAnswer) {
            correct++;
          }
        } else if (question.type === 'multiple' && Array.isArray(question.correctAnswers)) {
          const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          const correctAnswers = question.correctAnswers || [];
          // Porównaj ID wybranych opcji z ID poprawnych odpowiedzi
          const lengthMatch = userAnswers.length === correctAnswers.length;
          const allMatch = userAnswers.every(answerId => correctAnswers.includes(answerId));
          if (lengthMatch && allMatch) {
            correct++;
          }
        }
      }
    });
    
    return {
      score: correct,
      percentage: Math.round((correct / quiz.questions.length) * 100)
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>{t('Ładowanie quizu...')}</LoadingMessage>
      </Container>
    );
  }

  if (error || !quiz) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <Container key={updateKey}>
      <QuizCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Progress>
            {t('Pytanie')} {currentQuestionIndex + 1} / {quiz.questions.length}
          </Progress>
          <Timer timeLeft={timeLeft}>
            <FiClock />
            {formatTime(timeLeft)}
          </Timer>
        </Header>

        <QuestionCard>
          <QuestionTitle>{currentQuestion.question}</QuestionTitle>
          
          {currentQuestion.type === 'single' ? (
            <OptionsList>
              {currentQuestion.options.map((option, index) => (
                <OptionButton
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                  className={answers[currentQuestion.id] === option.id ? 'selected' : ''}
                >
                  {answers[currentQuestion.id] === option.id ? <FiCheck /> : null}
                  {option.text}
                </OptionButton>
              ))}
            </OptionsList>
          ) : (
            <CheckboxContainer>
              {currentQuestion.options.map((option, index) => {
                const currentAnswers = answers[currentQuestion.id] || [];
                const isSelected = currentAnswers.includes(option.id);
                
                return (
                  <CheckboxOption
                    key={option.id}
                    className={isSelected ? 'selected' : ''}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    />
                    {option.text}
                  </CheckboxOption>
                );
              })}
            </CheckboxContainer>
          )}
        </QuestionCard>

        <NavigationButtons>
          <NavButton
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="secondary"
          >
            <FiArrowLeft />
            {t('Poprzednie')}
          </NavButton>

          {isLastQuestion ? (
            <FinishButton onClick={handleFinish}>
              {t('Zakończ quiz')}
            </FinishButton>
          ) : (
            <NavButton
              onClick={handleNext}
              className="primary"
            >
              {t('Następne')}
              <FiArrowRight />
            </NavButton>
          )}
        </NavigationButtons>
      </QuizCard>
    </Container>
  );
};

export default QuizTaker; 