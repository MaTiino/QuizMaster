import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiBook, FiPlus } from 'react-icons/fi';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { useColors } from '../context/ColorContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-top: 70px;
`;

const Hero = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  color: ${props => props.theme.text};
  padding: 40px 20px;
  background: ${props => `linear-gradient(135deg, ${props.theme.primary}15 0%, ${props.theme.secondary}15 100%)`};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.white};
    opacity: 0.9;
    z-index: 1;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  margin-bottom: 40px;
  color: ${props => props.theme.textLight};
  max-width: 800px;
  line-height: 1.6;
  position: relative;
  z-index: 2;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
`;

const HeroButton = styled(Link)`
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  background: ${props => props.theme.gradient};
  color: white;
  text-decoration: none;
  box-shadow: 0 8px 25px ${props => props.theme.primary}40;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px ${props => props.theme.primary}60;
    color: white;
    
    &::before {
      left: 100%;
    }
  }
`;

const Home = () => {
  const { t, updateKey } = useTranslation();
  const { user } = useAuth();
  const { colors } = useColors();

  return (
    <HomeContainer>
      <Hero 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }} 
        key={updateKey}
      >
        <Title>QuizMaster</Title>
        <Subtitle>
          {t('Nowoczesna platforma e-learningowa do rozwiązywania i tworzenia quizów.')}<br />
          {t('Ucz się, sprawdzaj wiedzę i rywalizuj z innymi!')}<br />
          <span style={{ color: colors.secondary, fontWeight: 600 }}>{t('Dostępne po polsku i angielsku.')}</span>
        </Subtitle>
        <ButtonGroup>
          <HeroButton to="/quizzes">
            <FiBook />
            {t('Przeglądaj quizy')}
          </HeroButton>
          {user ? (
            <HeroButton to="/create-quiz">
              <FiPlus />
              {t('Utwórz własny quiz')}
            </HeroButton>
          ) : (
            <HeroButton to="/register">
              <FiPlus />
              {t('Zarejestruj się')}
            </HeroButton>
          )}
        </ButtonGroup>
      </Hero>
    </HomeContainer>
  );
};

export default Home; 