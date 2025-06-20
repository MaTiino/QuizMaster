import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiBook, FiUser, FiClock, FiBarChart2, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
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

const FilterSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.primary}10;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
  min-width: 80px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}15;
  }
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 30px;
`;

const QuizCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.primary}10;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary}30;
    text-decoration: none;
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
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${props => props.theme.textLight};
  background: ${props => props.theme.background};
  padding: 4px 8px;
  border-radius: 6px;
`;

const QuizStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${props => props.theme.textLight};
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const ActionButton = styled(Link)`
  background: ${props => props.theme.gradient};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.primary}50;
    color: white;
    text-decoration: none;
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textLight};
  font-size: 1.1rem;
`;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: 'all',
    category: 'all',
    difficulty: 'all'
  });
  const { t, updateKey } = useTranslation();
  const { colors } = useColors();

  useEffect(() => {
    fetchQuizzes();
  }, [updateKey]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
      setError(null);
    } catch (err) {
      setError(t('Błąd podczas pobierania quizów.'));
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filters.language !== 'all' && quiz.language !== filters.language) return false;
    if (filters.category !== 'all' && quiz.category !== filters.category) return false;
    if (filters.difficulty !== 'all' && quiz.difficulty !== filters.difficulty) return false;
    return true;
  });

  const categories = [...new Set(quizzes.map(quiz => quiz.category))];
  const languages = [...new Set(quizzes.map(quiz => quiz.language))];

  if (loading) {
    return (
      <Container>
        <Title>{t('Dostępne quizy')}</Title>
        <LoadingMessage>{t('Ładowanie quizów...')}</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>{t('Dostępne quizy')}</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container key={updateKey}>
      <Title>{t('Dostępne quizy')}</Title>
      
      <FilterSection>
        <FilterRow>
          <div>
            <FilterLabel htmlFor="category-filter">{t('Kategoria')}</FilterLabel>
            <FilterSelect 
              id="category-filter"
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">{t('Wszystkie')}</option>
              {categories.map(cat => <option key={cat} value={cat}>{t(cat)}</option>)}
            </FilterSelect>
          </div>
          <div>
            <FilterLabel htmlFor="difficulty-filter">{t('Poziom trudności')}</FilterLabel>
            <FilterSelect 
              id="difficulty-filter"
              value={filters.difficulty} 
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="all">{t('Wszystkie')}</option>
              <option value="easy">{t('Łatwy')}</option>
              <option value="medium">{t('Średni')}</option>
              <option value="hard">{t('Trudny')}</option>
            </FilterSelect>
          </div>
          <div>
            <FilterLabel htmlFor="language-filter">{t('Język')}</FilterLabel>
            <FilterSelect 
              id="language-filter"
              value={filters.language} 
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="all">{t('Wszystkie')}</option>
              {languages.map(lang => <option key={lang} value={lang}>{lang === 'pl' ? t('Polski') : t('Angielski')}</option>)}
            </FilterSelect>
          </div>
        </FilterRow>
      </FilterSection>

      {filteredQuizzes.length > 0 ? (
        <QuizGrid>
          {filteredQuizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              as={Link}
              to={`/quiz/${quiz.id}`}
            >
              <QuizTitle>{quiz.title}</QuizTitle>
              <QuizDescription>{quiz.description}</QuizDescription>
              
              <QuizMeta>
                <MetaItem>
                  <FiBook />
                  {t('Pytania')}: {quiz.questionCount || 0}
                </MetaItem>
                <MetaItem>
                  <FiUser />
                  {t('Autor')}: {quiz.author || t('Anonim')}
                </MetaItem>
                <MetaItem>
                  <FiClock />
                  {t('Utworzono')}: {new Date(quiz.createdAt).toLocaleDateString()}
                </MetaItem>
              </QuizMeta>

              <QuizStats>
                <StatsRow>
                  <StatItem>
                    {t('Poziom')}: {t(quiz.difficulty === 'easy' ? 'Łatwy' : quiz.difficulty === 'medium' ? 'Średni' : 'Trudny')}
                  </StatItem>
                  <StatItem>
                    {t('Podejścia')}: <StatValue>{quiz.totalAttempts || 0}</StatValue>
                  </StatItem>
                  <StatItem>
                    {t('Średni wynik')}: <StatValue>{quiz.averageScore || 0}%</StatValue>
                  </StatItem>
                </StatsRow>
                <ActionButton to={`/quiz/${quiz.id}`}>
                  <FiEye />
                  {t('Zobacz')}
                </ActionButton>
              </QuizStats>
            </QuizCard>
          ))}
        </QuizGrid>
      ) : (
        <EmptyMessage>
          {t('Nie znaleziono quizów spełniających wybrane kryteria.')}
        </EmptyMessage>
      )}
    </Container>
  );
};

export default QuizList; 