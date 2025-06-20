import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, updateKey } = useTranslation();

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [updateKey]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/user/stats');
      setStats(res.data);
    } catch {
      setStats(null);
    }
    setLoading(false);
  };

  return (
    <motion.div className="container fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={updateKey}>
      <div className="card" style={{ maxWidth: 500, margin: '40px auto' }}>
        <h2 style={{ marginBottom: 16 }}>{t('Twój profil')}</h2>
        <div style={{ marginBottom: 16 }}>
          <b>{t('Nazwa użytkownika')}:</b> {user?.username}
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>{t('E-mail')}:</b> {user?.email}
        </div>
        {loading ? (
          <div>{t('Ładowanie statystyk...')}</div>
        ) : stats ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <b>{t('Quizy rozwiązane')}:</b> {stats.totalQuizzes}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>{t('Średni wynik')}:</b> {stats.averageScore}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>{t('Łączny czas rozwiązywania')}:</b> {stats.totalTime} {t('sekund')}
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>{t('Unikalnych quizów ukończonych')}:</b> {stats.quizzesCompleted}
            </div>
          </>
        ) : (
          <div>{t('Brak statystyk do wyświetlenia.')}</div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile; 