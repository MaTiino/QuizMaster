import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { useColors } from '../context/ColorContext';

// Konfiguracja axios
axios.defaults.baseURL = 'http://localhost:5000';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 90px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.secondary};
    transform: translateX(-5px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: ${props => props.theme.text};
  text-align: center;
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.primary}10;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}15;
    transform: translateY(-1px);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}15;
    transform: translateY(-1px);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}15;
    transform: translateY(-1px);
  }
`;

const QuestionCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const QuestionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const RemoveButton = styled.button`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
`;

const OptionInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}15;
  }
`;

const AddButton = styled.button`
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-top: 16px;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.primary}50;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
`;

const SaveButton = styled.button`
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px ${props => props.theme.primary}50;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin-bottom: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}05;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }
`;

const QuizCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, updateKey } = useTranslation();
  const { colors } = useColors();
  
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    language: 'pl',
    timeLimit: 300
  });
  
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      type: 'single',
      options: [
        { id: 'opt_1_0', text: '' },
        { id: 'opt_1_1', text: '' },
        { id: 'opt_1_2', text: '' },
        { id: 'opt_1_3', text: '' }
      ],
      correctAnswer: '',
      correctAnswers: []
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'single',
      options: [
        { id: `opt_${Date.now()}_0`, text: '' },
        { id: `opt_${Date.now()}_1`, text: '' },
        { id: `opt_${Date.now()}_2`, text: '' },
        { id: `opt_${Date.now()}_3`, text: '' }
      ],
      correctAnswer: '',
      correctAnswers: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updatedQuestion = { ...q, [field]: value };
        
        // Resetuj poprawne odpowiedzi przy zmianie typu pytania
        if (field === 'type') {
          if (value === 'single') {
            updatedQuestion.correctAnswer = '';
            updatedQuestion.correctAnswers = [];
          } else {
            updatedQuestion.correctAnswer = '';
            updatedQuestion.correctAnswers = [];
          }
        }
        
        return updatedQuestion;
      }
      return q;
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], text: value };
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleCorrectAnswerChange = (questionId, answerId, isChecked) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        if (q.type === 'single') {
          return { ...q, correctAnswer: answerId };
        } else {
          let newCorrectAnswers = [...(q.correctAnswers || [])];
          if (isChecked) {
            if (!newCorrectAnswers.includes(answerId)) {
              newCorrectAnswers.push(answerId);
            }
          } else {
            newCorrectAnswers = newCorrectAnswers.filter(a => a !== answerId);
          }
          return { ...q, correctAnswers: newCorrectAnswers };
        }
      }
      return q;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('Musisz być zalogowany, aby utworzyć quiz.'));
      return;
    }

    // Walidacja
    if (!quiz.title.trim() || !quiz.description.trim() || !quiz.category.trim()) {
      setError(t('Wypełnij wszystkie wymagane pola.'));
      return;
    }

    const validQuestions = questions.filter(q => {
      if (!q.question.trim() || !q.options.some(opt => opt.text.trim())) {
        return false;
      }
      
      if (q.type === 'single') {
        return q.correctAnswer && q.correctAnswer !== '';
      } else {
        return q.correctAnswers && q.correctAnswers.length > 0;
      }
    });

    if (validQuestions.length === 0) {
      setError(t('Dodaj przynajmniej jedno pytanie z opcjami i poprawną odpowiedzią.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const quizData = {
        ...quiz,
        questions: validQuestions.map(q => ({
          ...q,
          correctAnswer: q.type === 'single' ? q.correctAnswer : null,
          correctAnswers: q.type === 'multiple' ? q.correctAnswers : null
        }))
      };

      const response = await axios.post('/api/quizzes', quizData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess(t('Quiz został utworzony pomyślnie!'));
      setTimeout(() => {
        navigate(`/quiz/${response.data.id}`);
      }, 2000);
    } catch (err) {
      setError(t('Błąd podczas tworzenia quizu.'));
      console.error('Error creating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container key={updateKey}>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft />
        {t('Wróć')}
      </BackButton>

      <Title>{t('Stwórz nowy quiz')}</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <FormGroup>
          <Label htmlFor="title">{t('Tytuł quizu')}</Label>
          <Input 
            type="text" 
            id="title" 
            value={quiz.title} 
            onChange={(e) => setQuiz({...quiz, title: e.target.value})}
            placeholder={t('Wprowadź tytuł quizu')}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">{t('Opis quizu')}</Label>
          <Textarea 
            id="description" 
            value={quiz.description} 
            onChange={(e) => setQuiz({...quiz, description: e.target.value})}
            placeholder={t('Wprowadź opis quizu')}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="category">{t('Kategoria')}</Label>
          <Input
            type="text"
            id="category"
            value={quiz.category}
            onChange={(e) => setQuiz({...quiz, category: e.target.value})}
            placeholder={t('np. Geografia, Historia, Nauka')}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="difficulty">{t('Poziom trudności')}</Label>
          <Select id="difficulty" value={quiz.difficulty} onChange={(e) => setQuiz({...quiz, difficulty: e.target.value})}>
            <option value="easy">{t('Łatwy')}</option>
            <option value="medium">{t('Średni')}</option>
            <option value="hard">{t('Trudny')}</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="language">{t('Język quizu')}</Label>
          <Select id="language" value={quiz.language} onChange={(e) => setQuiz({...quiz, language: e.target.value})}>
            <option value="pl">{t('Polski')}</option>
            <option value="en">{t('Angielski')}</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="timeLimit">{t('Limit czasu (sekundy)')}</Label>
          <Input
            type="number"
            id="timeLimit"
            value={quiz.timeLimit}
            onChange={(e) => setQuiz({...quiz, timeLimit: parseInt(e.target.value) || 300})}
            min="60"
            max="3600"
          />
        </FormGroup>
      </FormCard>

      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 style={{ marginBottom: '24px', color: colors.text }}>{t('Pytania')}</h2>

        {questions.map((question, index) => (
          <QuestionCard key={question.id}>
            <QuestionHeader>
              <QuestionTitle>{t('Pytanie')} {index + 1}</QuestionTitle>
              {questions.length > 1 && (
                <RemoveButton onClick={() => removeQuestion(question.id)}>
                  <FiTrash2 />
                  {t('Usuń')}
                </RemoveButton>
              )}
            </QuestionHeader>

            <FormGroup>
              <Label htmlFor={`question-${question.id}`}>{t('Treść pytania')} *</Label>
              <Textarea
                id={`question-${question.id}`}
                value={question.question}
                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                placeholder={t('Wprowadź pytanie')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor={`type-${question.id}`}>{t('Typ pytania')}</Label>
              <Select
                id={`type-${question.id}`}
                value={question.type}
                onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
              >
                <option value="single">{t('Pojedynczy wybór')}</option>
                <option value="multiple">{t('Wielokrotny wybór')}</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor={`options-${question.id}`}>{t('Opcje')} *</Label>
              {question.options.map((option, optIndex) => (
                <OptionInput
                  key={optIndex}
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                  placeholder={`${t('Opcja')} ${optIndex + 1}`}
                  required
                />
              ))}
            </FormGroup>

            <FormGroup>
              <Label htmlFor={`correct-answer-${question.id}`}>{question.type === 'single' ? t('Poprawna odpowiedź') : t('Poprawne odpowiedzi')} *</Label>
              {question.type === 'single' ? (
                <Select
                  id={`correct-answer-${question.id}`}
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(question.id, e.target.value, true)}
                  required
                >
                  <option value="">{t('Wybierz poprawną odpowiedź')}</option>
                  {question.options.map((option, optIndex) => (
                    option.text.trim() && (
                      <option key={optIndex} value={option.id}>
                        {option.text}
                      </option>
                    )
                  ))}
                </Select>
              ) : (
                <CheckboxContainer>
                  {question.options.map((option, optIndex) => (
                    option.text.trim() && (
                      <CheckboxItem key={optIndex}>
                        <input
                          type="checkbox"
                          checked={question.correctAnswers?.includes(option.id) || false}
                          onChange={(e) => handleCorrectAnswerChange(question.id, option.id, e.target.checked)}
                        />
                        {option.text}
                      </CheckboxItem>
                    )
                  ))}
                </CheckboxContainer>
              )}
            </FormGroup>
          </QuestionCard>
        ))}

        <AddButton onClick={addQuestion}>
          <FiPlus />
          {t('Dodaj pytanie')}
        </AddButton>
      </FormCard>

      <ActionButtons>
        <SaveButton onClick={handleSubmit} disabled={loading}>
          <FiSave />
          {loading ? t('Zapisywanie...') : t('Zapisz quiz')}
        </SaveButton>
      </ActionButtons>
    </Container>
  );
};

export default QuizCreator; 