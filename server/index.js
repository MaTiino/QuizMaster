const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  initDatabase,
  createUser,
  findUserByUsername,
  findUserById,
  createQuiz,
  addQuestions,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
  getUserQuizzes,
  saveResult,
  getUserResults,
  getUserStats,
  getQuizStats,
  getCategories
} = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware do weryfikacji tokenu
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Rejestracja użytkownika
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 10);

    // Utwórz nowego użytkownika
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: 'user'
    };

    await createUser(newUser);

    // Generuj token
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logowanie użytkownika
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Znajdź użytkownika
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Sprawdź hasło
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generuj token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz wszystkie quizy
app.get('/api/quizzes', async (req, res) => {
  try {
    const { language, category, difficulty } = req.query;
    let quizzes = await getAllQuizzes();
    // Filtrowanie
    if (language) quizzes = quizzes.filter(q => q.language === language);
    if (category) quizzes = quizzes.filter(q => q.category === category);
    if (difficulty) quizzes = quizzes.filter(q => q.difficulty === difficulty);
    // Dodaj liczbę pytań i statystyki do każdego quizu
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const fullQuiz = await getQuizById(quiz.id);
        const stats = await getQuizStats(quiz.id);
        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          author: quiz.author,
          createdAt: quiz.created_at,
          timeLimit: Number(quiz.time_limit) || 300,
          difficulty: quiz.difficulty,
          category: quiz.category,
          language: quiz.language,
          questionCount: fullQuiz ? fullQuiz.questions.length : 0,
          totalAttempts: stats.totalAttempts || 0,
          averageScore: stats.averageScore ? Math.round(stats.averageScore * 100) / 100 : 0
        };
      })
    );
    res.json(quizzesWithStats);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz quiz po ID (dodaj camelCase timeLimit, author, createdAt)
app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const quiz = await getQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    quiz.timeLimit = Number(quiz.time_limit) || 300;
    quiz.createdAt = quiz.created_at;
    delete quiz.time_limit;
    delete quiz.created_at;
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz by id error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Utwórz nowy quiz
app.post('/api/quizzes', authenticateToken, async (req, res) => {
  try {
    const { title, description, questions, timeLimit, difficulty, category, language } = req.body;

    const newQuiz = {
      id: uuidv4(),
      title,
      description,
      author: req.user.username,
      timeLimit: Number(timeLimit) || 300,
      difficulty: difficulty || 'medium',
      category: category || 'General',
      language: language || 'pl'
    };

    await createQuiz(newQuiz);
    await addQuestions(newQuiz.id, questions.map(q => ({ ...q, id: uuidv4() })));

    let createdQuiz = await getQuizById(newQuiz.id);
    // Mapuj time_limit na timeLimit
    if (createdQuiz) {
      createdQuiz.timeLimit = Number(createdQuiz.time_limit) || 300;
      delete createdQuiz.time_limit;
    }
    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Usuń quiz (tylko autor może usunąć swój quiz)
app.delete('/api/quizzes/:id', authenticateToken, async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await getQuizById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Sprawdź czy użytkownik jest autorem quizu
    if (quiz.author !== req.user.username) {
      return res.status(403).json({ error: 'You can only delete your own quizzes' });
    }
    
    // Usuń quiz (wyniki zostaną usunięte automatycznie przez CASCADE)
    await deleteQuiz(quizId);
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz quizy użytkownika
app.get('/api/user/quizzes', authenticateToken, async (req, res) => {
  try {
    const userQuizzes = await getUserQuizzes(req.user.username);
    // Dodaj liczbę pytań i statystyki do każdego quizu
    const quizzesWithStats = await Promise.all(
      userQuizzes.map(async (quiz) => {
        const fullQuiz = await getQuizById(quiz.id);
        const stats = await getQuizStats(quiz.id);
        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          author: quiz.author,
          createdAt: quiz.created_at,
          timeLimit: Number(quiz.time_limit) || 300,
          difficulty: quiz.difficulty,
          category: quiz.category,
          language: quiz.language,
          questionCount: fullQuiz ? fullQuiz.questions.length : 0,
          totalAttempts: stats.totalAttempts || 0,
          averageScore: stats.averageScore ? Math.round(stats.averageScore) : 0,
        };
      })
    );
    res.json(quizzesWithStats);
  } catch (error) {
    console.error('Get user quizzes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Zapisz wynik quizu
app.post('/api/results', authenticateToken, async (req, res) => {
  try {
    const { quizId, answers, timeSpent, score } = req.body;

    // Znajdź quiz, żeby pobrać liczbę pytań
    const quiz = await getQuizById(quizId);
    const totalQuestions = quiz ? quiz.questions.length : 0;

    const result = {
      id: uuidv4(),
      userId: req.user.id,
      username: req.user.username,
      quizId,
      answers,
      timeSpent,
      score,
      totalQuestions
    };

    await saveResult(result);
    res.status(201).json(result);
  } catch (error) {
    console.error('Save result error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz wyniki użytkownika
app.get('/api/results', authenticateToken, async (req, res) => {
  try {
    const results = await getUserResults(req.user.id);
    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz statystyki quizu (publiczny endpoint)
app.get('/api/quizzes/:id/stats', async (req, res) => {
  try {
    const stats = await getQuizStats(req.params.id);
    res.json({
      totalAttempts: stats.totalAttempts || 0,
      averageScore: stats.averageScore ? Math.round(stats.averageScore) : 0,
      averageTime: Math.round(stats.averageTime || 0)
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz kategorie quizów
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pobierz statystyki użytkownika
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id);
    res.json({
      totalQuizzes: stats.totalQuizzes,
      averageScore: Math.round(stats.averageScore),
      totalTime: Math.round(stats.totalTime),
      quizzesCompleted: stats.quizzesCompleted
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 