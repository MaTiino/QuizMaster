import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiBook, FiUser, FiClock, FiBarChart2, FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { useColors } from '../context/ColorContext';

// Konfiguracja axios
axios.defaults.baseURL = 'http://localhost:5000';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 90px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: ${props => props.theme.text};
  text-align: center;
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const QuizCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.primary}10;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary}30;
  }
`;

const QuizTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
`;

const QuizDescription = styled.p`
  color: ${props => props.theme.textLight};
  margin-bottom: 16px;
  line-height: 1.5;
`;

const QuizMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.textLight};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QuizStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${props => props.theme.textLight};
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.primary}50;
    color: white;
  }

  &.danger {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.text};
`;

const EmptyDescription = styled.p`
  color: ${props => props.theme.textLight};
  margin-bottom: 24px;
  line-height: 1.6;
`;

const CreateButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px ${props => props.theme.primary}50;
    color: white;
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

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, updateKey } = useTranslation();
  const { user } = useAuth();
  const { colors } = useColors();

  useEffect(() => {
    fetchMyQuizzes();
  }, [updateKey]);

  const fetchMyQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/quizzes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuizzes(response.data);
      setError(null);
    } catch (err) {
      setError(t('Błąd podczas pobierania quizów.'));
      console.error('Error fetching my quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm(t('Czy na pewno chcesz usunąć ten quiz? Tej operacji nie można cofnąć.'))) {
      return;
    }

    try {
      await axios.delete(`/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (err) {
      alert(t('Błąd podczas usuwania quizu.'));
      console.error('Error deleting quiz:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>{t('Moje Quizy')}</Title>
        <LoadingMessage>{t('Ładowanie quizów...')}</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>{t('Moje Quizy')}</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{t('Moje Quizy')}</Title>
      
      {quizzes.length === 0 ? (
        <EmptyState>
          <EmptyTitle>{t('Nie masz jeszcze żadnych quizów')}</EmptyTitle>
          <EmptyDescription>
            {t('Utwórz swój pierwszy quiz i udostępnij go innym!')}
          </EmptyDescription>
          <CreateButton to="/create-quiz">
            <FiPlus />
            {t('Utwórz pierwszy quiz')}
          </CreateButton>
        </EmptyState>
      ) : (
        <QuizGrid>
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <QuizTitle>{quiz.title}</QuizTitle>
              <QuizDescription>{quiz.description}</QuizDescription>
              
              <QuizMeta>
                <MetaItem>
                  <FiBook />
                  {t('Pytania')}: {quiz.questionCount || 0}
                </MetaItem>
                <MetaItem>
                  <FiClock />
                  {t('Utworzono')}: {new Date(quiz.createdAt).toLocaleDateString()}
                </MetaItem>
              </QuizMeta>

              <QuizStats>
                <StatsRow>
                  <StatItem>
                    <FiBarChart2 />
                    {t('Poziom')}: {t(quiz.difficulty === 'easy' ? 'Łatwy' : quiz.difficulty === 'medium' ? 'Średni' : 'Trudny')}
                  </StatItem>
                  <StatItem>
                    <FiUser />
                    {t('Język')}: {quiz.language === 'pl' ? t('Polski') : t('Angielski')}
                  </StatItem>
                  <StatItem>
                    <FiBarChart2 />
                    {t('Podejścia')}: <StatValue>{quiz.totalAttempts || 0}</StatValue>
                  </StatItem>
                  <StatItem>
                    <FiBarChart2 />
                    {t('Średni wynik')}: <StatValue>{quiz.averageScore || 0}%</StatValue>
                  </StatItem>
                </StatsRow>
                <ButtonGroup>
                  <ActionButton to={`/quiz/${quiz.id}`}>
                    <FiEye />
                    {t('Podgląd')}
                  </ActionButton>
                  <ActionButton 
                    as="button"
                    className="danger"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    <FiTrash2 />
                    {t('Usuń')}
                  </ActionButton>
                </ButtonGroup>
              </QuizStats>
            </QuizCard>
          ))}
        </QuizGrid>
      )}
    </Container>
  );
};

export default MyQuizzes; 