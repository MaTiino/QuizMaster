import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiCheck, FiX, FiArrowLeft, FiBarChart2, FiClock, FiUsers } from 'react-icons/fi';
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

const ResultsCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.primary}10;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.text};
`;

const ScoreSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
`;

const ScoreCard = styled.div`
  background: ${props => props.isUser ? props.theme.gradient : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'};
  color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
`;

const ScoreTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const StatsSection = styled.div`
  background: ${props => props.theme.background};
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
`;

const StatsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.text};
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textLight};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const ActionButton = styled.button`
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

const QuizResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { colors } = useColors();
  
  const [quiz, setQuiz] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dane z poprzedniej strony (QuizTaker)
  const userResult = location.state;

  useEffect(() => {
    fetchQuizAndStats();
  }, [id]);

  const fetchQuizAndStats = async () => {
    try {
      setLoading(true);
      
      // Pobierz quiz
      const quizResponse = await axios.get(`/api/quizzes/${id}`);
      setQuiz(quizResponse.data);
      
      // Pobierz statystyki quizu
      const statsResponse = await axios.get(`/api/quizzes/${id}/stats`);
      setStats(statsResponse.data);
      
      setError(null);
    } catch (err) {
      setError(t('Błąd podczas pobierania wyników.'));
      console.error('Error fetching quiz results:', err);
    } finally {
      setLoading(false);
    }
  };

  // Zabezpieczenie przed NaN, stringami i brakiem danych
  const safe = (val, fallback = 0) => {
    if (typeof val === 'number' && !isNaN(val)) return val;
    if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) return Number(val);
    return fallback;
  };
  const score = safe(userResult?.score);
  const totalQuestions = safe(userResult?.totalQuestions);
  const timeTaken = safe(userResult?.timeTaken);

  const userPercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const averagePercentage = stats && typeof stats.averageScore === 'number' ? Math.round(stats.averageScore) : 0;

  // Poprawione formatowanie czasu
  const formatTime = (seconds) => {
    seconds = safe(seconds);
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Zabezpieczenie przed ujemnymi wartościami błędnych odpowiedzi
  const wrongAnswers = Math.max(0, totalQuestions - score);

  if (loading) {
    return (
      <Container>
        <LoadingMessage>{t('Ładowanie wyników...')}</LoadingMessage>
      </Container>
    );
  }

  if (error || !quiz || !userResult) {
    return (
      <Container>
        <ErrorMessage>{error || t('Nie znaleziono wyników.')}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <ResultsCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>{t('Wyniki dla')}: {quiz.title}</Title>
        </Header>

        <ScoreSection>
          <ScoreCard isUser>
            <ScoreTitle>{t('Twój wynik')}</ScoreTitle>
            <ScoreValue>{userPercentage}%</ScoreValue>
            <ScoreLabel>
              {score} / {totalQuestions} {t('poprawnych odpowiedzi')}
            </ScoreLabel>
          </ScoreCard>
          <ScoreCard>
            <ScoreTitle>{t('Średnia globalna')}</ScoreTitle>
            <ScoreValue>{averagePercentage}%</ScoreValue>
            <ScoreLabel>
              {t('Na podstawie')} {stats?.totalAttempts || 0} {t('podejść')}
            </ScoreLabel>
          </ScoreCard>
        </ScoreSection>

        <StatsSection>
          <StatsTitle>{t('Podsumowanie')}</StatsTitle>
          <StatsGrid>
            <StatItem>
              <StatIcon color="#28a745">
                <FiCheck />
              </StatIcon>
              <StatContent>
                <StatValue>{score}</StatValue>
                <StatLabel>{t('Poprawne odpowiedzi')}</StatLabel>
              </StatContent>
            </StatItem>
            <StatItem>
              <StatIcon color="#dc3545">
                <FiX />
              </StatIcon>
              <StatContent>
                <StatValue>{wrongAnswers}</StatValue>
                <StatLabel>{t('Błędne odpowiedzi')}</StatLabel>
              </StatContent>
            </StatItem>
            <StatItem>
              <StatIcon>
                <FiClock />
              </StatIcon>
              <StatContent>
                <StatValue>{formatTime(timeTaken)}</StatValue>
                <StatLabel>{t('Czas ukończenia')}</StatLabel>
              </StatContent>
            </StatItem>
            <StatItem>
              <StatIcon>
                <FiUsers />
              </StatIcon>
              <StatContent>
                <StatValue>{stats?.totalAttempts || 0}</StatValue>
                <StatLabel>{t('Liczba podejść')}</StatLabel>
              </StatContent>
            </StatItem>
          </StatsGrid>
        </StatsSection>
        
        <ActionButtons>
          <ActionButton className="secondary" onClick={() => navigate('/quizzes')}>
            <FiArrowLeft />
            {t('Przeglądaj inne quizy')}
          </ActionButton>
          <ActionButton className="primary" onClick={() => navigate(`/quiz/${id}/take`)}>
            <FiBarChart2 />
            {t('Spróbuj ponownie')}
          </ActionButton>
        </ActionButtons>
      </ResultsCard>
    </Container>
  );
};

export default QuizResults;
