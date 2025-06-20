import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiBook, FiUser, FiClock, FiBarChart2, FiPlay, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
import { useColors } from '../context/ColorContext';

// Konfiguracja axios
axios.defaults.baseURL = 'http://localhost:5000';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 90px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white !important;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background: ${props => props.colors.primary};
  border-radius: 8px;
  padding: 10px 20px;
  border: none;
  box-shadow: 0 2px 8px ${props => props.colors.primary}30;

  &:hover {
    background: ${props => props.colors.secondary};
    color: white !important;
    transform: translateX(-5px);
  }
`;

const QuizCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.colors.primary}10;
`;

const QuizTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.colors.text};
`;

const QuizDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.colors.textLight};
  margin-bottom: 24px;
  line-height: 1.6;
`;

const QuizMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding: 20px;
  background: ${props => props.colors.primary}05;
  border-radius: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: ${props => props.colors.text};
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: ${props => props.colors.primary};
`;

const StartButton = styled(Link)`
  background: ${props => props.gradient};
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 25px ${props => props.colors.primary}30;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px ${props => props.colors.primary}50;
    color: white;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.colors.textLight};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
  font-size: 1.1rem;
`;

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, updateKey } = useTranslation();
  const { colors } = useColors();

  useEffect(() => {
    fetchQuiz();
  }, [id, updateKey]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/quizzes/${id}`);
      setQuiz(response.data);
      setError(null);
    } catch (err) {
      setError(t('Nie znaleziono quizu.'));
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage colors={colors}>{t('Ładowanie quizu...')}</LoadingMessage>
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

  return (
    <Container>
      <BackButton to="/quizzes" colors={colors}>
        <FiArrowLeft />
        {t('Powrót do listy quizów')}
      </BackButton>

      <QuizCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        colors={colors}
      >
        <QuizTitle colors={colors}>{quiz.title}</QuizTitle>
        <QuizDescription colors={colors}>{quiz.description}</QuizDescription>

        <QuizMeta colors={colors}>
          <MetaItem colors={colors}>
            <FiUser />
            <MetaLabel colors={colors}>{t('Autor')}:</MetaLabel>
            {quiz.author}
          </MetaItem>
          <MetaItem colors={colors}>
            <FiBook />
            <MetaLabel colors={colors}>{t('Liczba pytań')}:</MetaLabel>
            {quiz.questions?.length || 0}
          </MetaItem>
          <MetaItem colors={colors}>
            <FiBarChart2 />
            <MetaLabel colors={colors}>{t('Poziom')}:</MetaLabel>
            {quiz.difficulty}
          </MetaItem>
          <MetaItem colors={colors}>
            <FiClock />
            <MetaLabel colors={colors}>{t('Język')}:</MetaLabel>
            {quiz.language === 'pl' ? t('Polski') : t('Angielski')}
          </MetaItem>
          <MetaItem colors={colors}>
            <FiClock />
            <MetaLabel colors={colors}>{t('Utworzono')}:</MetaLabel>
            {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : t('Brak danych')}
          </MetaItem>
        </QuizMeta>

        <div style={{ textAlign: 'center' }}>
          <StartButton to={`/quiz/${quiz.id}/take`} gradient={colors.gradient} colors={colors}>
            <FiPlay />
            {t('Rozpocznij quiz')}
          </StartButton>
        </div>
      </QuizCard>
    </Container>
  );
};

export default QuizDetail; 