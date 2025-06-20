import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';
import { useColors } from '../context/ColorContext';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, updateKey } = useTranslation();
  const { colors } = useColors();

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line
  }, [updateKey]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/results');
      setResults(res.data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const getScorePercentage = (score, totalQuestions) => {
    if (!totalQuestions) return 0;
    return Math.round((score / totalQuestions) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745'; // zielony
    if (percentage >= 60) return '#ffc107'; // żółty
    return '#dc3545'; // czerwony
  };

  return (
    <motion.div className="container fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={updateKey}>
      <h2 style={{ margin: '32px 0 24px 0', textAlign: 'center' }}>{t('Twoje wyniki')}</h2>
      {loading ? (
        <div>{t('Ładowanie wyników...')}</div>
      ) : results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>{t('Nie masz jeszcze żadnych wyników')}</h3>
          <p>{t('Rozpocznij rozwiązywanie quizów, aby zobaczyć swoje wyniki!')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {results.map(result => {
            const totalQuestions = Number(result.totalQuestions) || (result.answers ? result.answers.length : '?');
            const percentage = getScorePercentage(result.score, totalQuestions);
            const scoreColor = getScoreColor(percentage);
            let dateStr = '?', timeStr = '?';
            if (result.completedAt && !isNaN(Date.parse(result.completedAt))) {
              const d = new Date(result.completedAt);
              dateStr = d.toLocaleDateString('pl-PL');
              timeStr = d.toLocaleTimeString('pl-PL');
            }
            return (
              <motion.div
                className="card fade-in"
                key={result.id}
                whileHover={{ scale: 1.04 }}
                style={{ minWidth: 300, maxWidth: 400 }}
              >
                <h3 style={{ marginBottom: 12, color: colors.primary }}>{result.quizTitle}</h3>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Kategoria')}:</b> {result.quizCategory}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Poziom')}:</b> {t(result.quizDifficulty === 'easy' ? 'Łatwy' : result.quizDifficulty === 'medium' ? 'Średni' : 'Trudny')}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Wynik')}:</b> {result.score} / {totalQuestions}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Procent')}:</b> 
                  <span style={{ color: scoreColor, fontWeight: 'bold', marginLeft: 8 }}>
                    {percentage}%
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Czas')}:</b> {typeof result.timeSpent === 'number' && !isNaN(result.timeSpent) ? result.timeSpent + ' ' + t('sekund') : '?'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Data')}:</b> {dateStr}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>{t('Godzina')}:</b> {timeStr}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Results; 