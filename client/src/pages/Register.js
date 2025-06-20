import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { t, updateKey } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await register(formData.username, formData.email, formData.password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <motion.div className="container fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={updateKey}>
      <div className="card" style={{ maxWidth: 400, margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{t('Zarejestruj się')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('Nazwa użytkownika')}</label>
            <input
              className="form-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('E-mail')}</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('Hasło')}</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('Powtórz hasło')}</label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? t('Rejestracja...') : t('Zarejestruj się')}
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {t('Masz już konto?')} <Link to="/login">{t('Zaloguj się tutaj')}</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Register; 