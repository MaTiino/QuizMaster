const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Utworzenie połączenia z bazą danych
const dbPath = path.join(__dirname, 'quiz_app.db');
const db = new sqlite3.Database(dbPath);

// Inicjalizacja bazy danych
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela użytkowników
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela quizów
      db.run(`
        CREATE TABLE IF NOT EXISTS quizzes (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          author TEXT NOT NULL,
          time_limit INTEGER DEFAULT 300,
          difficulty TEXT DEFAULT 'medium',
          category TEXT DEFAULT 'General',
          language TEXT DEFAULT 'pl',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author) REFERENCES users (username)
        )
      `);

      // Tabela pytań
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id TEXT PRIMARY KEY,
          quiz_id TEXT NOT NULL,
          question TEXT NOT NULL,
          type TEXT DEFAULT 'single',
          options TEXT NOT NULL,
          correct_answer TEXT,
          correct_answers TEXT,
          question_order INTEGER,
          FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
        )
      `);

      // Tabela wyników
      db.run(`
        CREATE TABLE IF NOT EXISTS results (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          username TEXT NOT NULL,
          quiz_id TEXT NOT NULL,
          answers TEXT,
          time_spent INTEGER,
          score INTEGER,
          total_questions INTEGER,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Błąd podczas tworzenia tabel:', err);
          reject(err);
        } else {
          console.log('Baza danych została zainicjalizowana');
          resolve();
        }
      });
    });
  });
};

// Funkcje pomocnicze do konwersji
const serializeArray = (arr) => JSON.stringify(arr);
const deserializeArray = (str) => str ? JSON.parse(str) : [];

// Funkcje dla użytkowników
const createUser = (user) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.id, user.username, user.email, user.password, user.role],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Funkcje dla quizów
const createQuiz = (quiz) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO quizzes (id, title, description, author, time_limit, difficulty, category, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [quiz.id, quiz.title, quiz.description, quiz.author, quiz.timeLimit, quiz.difficulty, quiz.category, quiz.language],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const addQuestions = (quizId, questions) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO questions (id, quiz_id, question, type, options, correct_answer, correct_answers, question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    
    questions.forEach((q, index) => {
      stmt.run([
        q.id,
        quizId,
        q.question,
        q.type,
        serializeArray(q.options), // Zachowaj pełną strukturę opcji
        q.type === 'single' ? q.correctAnswer : null,
        q.type === 'multiple' ? serializeArray(q.correctAnswers) : null,
        index
      ]);
    });
    
    stmt.finalize((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const getAllQuizzes = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM quizzes ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getQuizById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM quizzes WHERE id = ?', [id], (err, quiz) => {
      if (err) reject(err);
      else if (!quiz) resolve(null);
      else {
        // Pobierz pytania dla tego quizu
        db.all('SELECT * FROM questions WHERE quiz_id = ? ORDER BY question_order', [id], (err, questions) => {
          if (err) reject(err);
          else {
            const formattedQuestions = questions.map(q => {
              const options = deserializeArray(q.options);
              // Sprawdź czy opcje są w nowym formacie (obiekty z id i text)
              const formattedOptions = options.map((opt, index) => {
                if (typeof opt === 'object' && opt.id && opt.text) {
                  return opt; // Już w nowym formacie
                } else {
                  // Konwertuj ze starego formatu (string) na nowy format
                  return {
                    id: `opt_${q.id}_${index}`,
                    text: opt
                  };
                }
              });
              
              return {
                id: q.id,
                question: q.question,
                type: q.type,
                options: formattedOptions,
                correctAnswer: q.correct_answer,
                correctAnswers: q.correct_answers ? deserializeArray(q.correct_answers) : null
              };
            });
            
            resolve({
              ...quiz,
              questions: formattedQuestions
            });
          }
        });
      }
    });
  });
};

const deleteQuiz = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM quizzes WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

const getUserQuizzes = (username) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM quizzes WHERE author = ? ORDER BY created_at DESC', [username], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Funkcje dla wyników
const saveResult = (result) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO results (id, user_id, username, quiz_id, answers, time_spent, score, total_questions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [result.id, result.userId, result.username, result.quizId, serializeArray(result.answers), result.timeSpent, result.score, result.totalQuestions],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const getUserResults = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT r.*, q.title as quiz_title, q.category as quiz_category, q.difficulty as quiz_difficulty
      FROM results r
      LEFT JOIN quizzes q ON r.quiz_id = q.id
      WHERE r.user_id = ?
      ORDER BY r.completed_at DESC
    `, [userId], (err, rows) => {
      if (err) reject(err);
      else {
        const results = rows.map(row => ({
          ...row,
          completedAt: row.completed_at,
          score: row.score,
          timeSpent: row.time_spent,
          totalQuestions: row.total_questions,
          quizTitle: row.quiz_title || 'Nieznany quiz',
          quizCategory: row.quiz_category || 'Nieznana kategoria',
          quizDifficulty: row.quiz_difficulty || 'Nieznany poziom',
          answers: deserializeArray(row.answers)
        }));
        resolve(results);
      }
    });
  });
};

const getUserStats = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        score,
        total_questions,
        time_spent,
        quiz_id
      FROM results 
      WHERE user_id = ?
    `, [userId], (err, rows) => {
      if (err) reject(err);
      else {
        const totalQuizzes = rows.length;
        let totalScore = 0;
        let totalTime = 0;
        const uniqueQuizzes = new Set();
        
        rows.forEach(row => {
          if (row.total_questions > 0) {
            totalScore += (row.score / row.total_questions) * 100;
          }
          totalTime += row.time_spent || 0;
          uniqueQuizzes.add(row.quiz_id);
        });
        
        const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
        const quizzesCompleted = uniqueQuizzes.size;
        
        resolve({
          totalQuizzes: totalQuizzes || 0,
          averageScore: averageScore || 0,
          totalTime: totalTime || 0,
          quizzesCompleted: quizzesCompleted || 0
        });
      }
    });
  });
};

const getQuizStats = (quizId) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        score,
        total_questions
      FROM results 
      WHERE quiz_id = ?
    `, [quizId], (err, rows) => {
      if (err) reject(err);
      else {
        const totalAttempts = rows.length;
        let totalScore = 0;
        let totalTime = 0;
        
        rows.forEach(row => {
          if (row.total_questions > 0) {
            totalScore += (row.score / row.total_questions) * 100;
          }
          totalTime += row.time_spent || 0;
        });
        
        const averageScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;
        const averageTime = totalAttempts > 0 ? totalTime / totalAttempts : 0;
        
        resolve({
          totalAttempts: totalAttempts || 0,
          averageScore: averageScore || 0,
          averageTime: averageTime || 0
        });
      }
    });
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT DISTINCT category FROM quizzes WHERE category IS NOT NULL', (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => row.category));
    });
  });
};

module.exports = {
  db,
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
}; 