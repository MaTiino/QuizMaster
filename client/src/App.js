import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import QuizCreator from './pages/QuizCreator';
import QuizTaker from './pages/QuizTaker';
import QuizResults from './pages/QuizResults';
import Profile from './pages/Profile';
import Results from './pages/Results';
import MyQuizzes from './pages/MyQuizzes';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { TranslationProvider } from './context/TranslationContext';
import { ColorProvider, useColors } from './context/ColorContext';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.gradient};
`;

const MainContent = styled(motion.main)`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// App Component
const AppContent = () => {
  const { user } = useAuth();
  const { colors } = useColors();

  return (
    <AppContainer>
      <Navbar />
      <MainContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/:id" element={<QuizDetail />} />
            <Route 
              path="/quiz/:id/take" 
              element={
                <ProtectedRoute>
                  <QuizTaker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results/:id" 
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-quiz" 
              element={
                <ProtectedRoute>
                  <QuizCreator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-quizzes" 
              element={
                <ProtectedRoute>
                  <MyQuizzes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </MainContent>
    </AppContainer>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <ColorProvider>
        <TranslationProvider>
          <Router>
            <AppContent />
          </Router>
        </TranslationProvider>
      </ColorProvider>
    </AuthProvider>
  );
};

export default App; 