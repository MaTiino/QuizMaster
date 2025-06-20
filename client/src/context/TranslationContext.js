import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Konfiguracja axios
axios.defaults.baseURL = 'http://localhost:5000';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pl');
  const [isLoading, setIsLoading] = useState(true);
  const [updateKey, setUpdateKey] = useState(0);
  const [translationCache, setTranslationCache] = useState({});

  const availableLanguages = [
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  // Statyczny słownik tłumaczeń
  const staticTranslations = {
    'pl': {
      'Strona główna': 'Strona główna',
      'Przeglądaj quizy': 'Przeglądaj quizy',
      'Utwórz quiz': 'Utwórz quiz',
      'Moje Quizy': 'Moje Quizy',
      'Wyniki': 'Wyniki',
      'Profil': 'Profil',
      'Zaloguj': 'Zaloguj',
      'Zarejestruj': 'Zarejestruj',
      'Wyloguj': 'Wyloguj',
      'Logowanie...': 'Logowanie...',
      'Rejestracja...': 'Rejestracja...',
      'Nowoczesna platforma e-learningowa do rozwiązywania i tworzenia quizów.': 'Nowoczesna platforma e-learningowa do rozwiązywania i tworzenia quizów.',
      'Ucz się, sprawdzaj wiedzę i rywalizuj z innymi!': 'Ucz się, sprawdzaj wiedzę i rywalizuj z innymi!',
      'Dostępne po polsku i angielsku.': 'Dostępne po polsku i angielsku.',
      'Utwórz własny quiz': 'Utwórz własny quiz',
      'Dostępne quizy': 'Dostępne quizy',
      'Wszystkie języki': 'Wszystkie języki',
      'Polski': 'Polski',
      'Angielski': 'Angielski',
      'Wszystkie kategorie': 'Wszystkie kategorie',
      'Wszystkie poziomy': 'Wszystkie poziomy',
      'Łatwy': 'Łatwy',
      'Średni': 'Średni',
      'Trudny': 'Trudny',
      'Ładowanie quizów...': 'Ładowanie quizów...',
      'Błąd podczas pobierania quizów.': 'Błąd podczas pobierania quizów.',
      'Brak quizów do wyświetlenia.': 'Brak quizów do wyświetlenia.',
      'Autor': 'Autor',
      'Pytania': 'Pytania',
      'Poziom': 'Poziom',
      'Język': 'Język',
      'Zobacz quiz': 'Zobacz quiz',
      'Stwórz nowy quiz': 'Stwórz nowy quiz',
      'Tytuł quizu': 'Tytuł quizu',
      'Opis quizu': 'Opis quizu',
      'Kategoria': 'Kategoria',
      'Poziom trudności': 'Poziom trudności',
      'Język quizu': 'Język quizu',
      'Dodaj pytanie': 'Dodaj pytanie',
      'Usuń pytanie': 'Usuń pytanie',
      'Pytanie': 'Pytanie',
      'Typ pytania': 'Typ pytania',
      'Pojedynczy wybór': 'Pojedynczy wybór',
      'Wielokrotny wybór': 'Wielokrotny wybór',
      'Opcje': 'Opcje',
      'Odpowiedź': 'Odpowiedź',
      'Poprawna odpowiedź': 'Poprawna odpowiedź',
      'Poprawne odpowiedzi': 'Poprawne odpowiedzi',
      'Błąd podczas tworzenia quizu.': 'Błąd podczas tworzenia quizu.',
      'Ładowanie quizu...': 'Ładowanie quizu...',
      'Nie znaleziono quizu.': 'Nie znaleziono quizu.',
      'Liczba pytań': 'Liczba pytań',
      'Rozpocznij quiz': 'Rozpocznij quiz',
      'Usuń quiz': 'Usuń quiz',
      'Usuwanie...': 'Usuwanie...',
      'Czy na pewno chcesz usunąć ten quiz? Tej operacji nie można cofnąć.': 'Czy na pewno chcesz usunąć ten quiz? Tej operacji nie można cofnąć.',
      'Błąd podczas usuwania quizu.': 'Błąd podczas usuwania quizu.',
      'Pozostały czas': 'Pozostały czas',
      'Czas minął!': 'Czas minął!',
      'Zakończ i sprawdź wynik': 'Zakończ i sprawdź wynik',
      'Twój wynik': 'Twój wynik',
      'Czas rozwiązania': 'Czas rozwiązania',
      'sekund': 'sekund',
      'Zobacz swoje wyniki': 'Zobacz swoje wyniki',
      'Twoje wyniki': 'Twoje wyniki',
      'Ładowanie wyników...': 'Ładowanie wyników...',
      'Nie masz jeszcze żadnych wyników': 'Nie masz jeszcze żadnych wyników',
      'Rozpocznij rozwiązywanie quizów, aby zobaczyć swoje wyniki!': 'Rozpocznij rozwiązywanie quizów, aby zobaczyć swoje wyniki!',
      'Wynik': 'Wynik',
      'Procent': 'Procent',
      'Czas': 'Czas',
      'Data': 'Data',
      'Godzina': 'Godzina',
      'Twój profil': 'Twój profil',
      'Nazwa użytkownika': 'Nazwa użytkownika',
      'E-mail': 'E-mail',
      'Quizy rozwiązane': 'Quizy rozwiązane',
      'Średni wynik': 'Średni wynik',
      'Łączny czas rozwiązywania': 'Łączny czas rozwiązywania',
      'Unikalnych quizów ukończonych': 'Unikalnych quizów ukończonych',
      'Ładowanie statystyk...': 'Ładowanie statystyk...',
      'Brak statystyk do wyświetlenia.': 'Brak statystyk do wyświetlenia.',
      'Nie masz jeszcze żadnych quizów': 'Nie masz jeszcze żadnych quizów',
      'Utwórz swój pierwszy quiz i udostępnij go innym!': 'Utwórz swój pierwszy quiz i udostępnij go innym!',
      'Utwórz pierwszy quiz': 'Utwórz pierwszy quiz',
      'Podgląd': 'Podgląd',
      'Utworzono': 'Utworzono',
      'Hasło': 'Hasło',
      'Zaloguj się': 'Zaloguj się',
      'Zarejestruj się': 'Zarejestruj się',
      'Nie masz konta?': 'Nie masz konta?',
      'Masz już konto?': 'Masz już konto?',
      'Zarejestruj się tutaj': 'Zarejestruj się tutaj',
      'Zaloguj się tutaj': 'Zaloguj się tutaj',
      'Błąd logowania': 'Błąd logowania',
      'Błąd rejestracji': 'Błąd rejestracji',
      'Użytkownik już istnieje': 'Użytkownik już istnieje',
      'Nieprawidłowe dane logowania': 'Nieprawidłowe dane logowania',
      'Błąd': 'Błąd',
      'Sukces': 'Sukces',
      'Anuluj': 'Anuluj',
      'Zapisz': 'Zapisz',
      'Edytuj': 'Edytuj',
      'Tak': 'Tak',
      'Nie': 'Nie',
      'OK': 'OK',
      'Zamknij': 'Zamknij',
      'Musisz być zalogowany, aby utworzyć quiz.': 'Musisz być zalogowany, aby utworzyć quiz.',
      'Wypełnij wszystkie wymagane pola.': 'Wypełnij wszystkie wymagane pola.',
      'Dodaj przynajmniej jedno pytanie z opcjami i poprawną odpowiedzią.': 'Dodaj przynajmniej jedno pytanie z opcjami i poprawną odpowiedzią.',
      'Quiz został utworzony pomyślnie!': 'Quiz został utworzony pomyślnie!',
      'Powrót do moich quizów': 'Powrót do moich quizów',
      'Informacje o quizie': 'Informacje o quizie',
      'Wprowadź tytuł quizu': 'Wprowadź tytuł quizu',
      'Wprowadź opis quizu': 'Wprowadź opis quizu',
      'np. Geografia, Historia, Nauka': 'np. Geografia, Historia, Nauka',
      'Limit czasu (sekundy)': 'Limit czasu (sekundy)',
      'Wprowadź pytanie': 'Wprowadź pytanie',
      'Opcja': 'Opcja',
      'Wybierz poprawną odpowiedź': 'Wybierz poprawną odpowiedź',
      'Zapisywanie...': 'Zapisywanie...',
      'Zapisz quiz': 'Zapisz quiz',
      'Podejścia': 'Podejścia',
      'Poprzednie': 'Poprzednie',
      'Następne': 'Następne',
      'Musisz być zalogowany, aby zapisać wynik.': 'Musisz być zalogowany, aby zapisać wynik.',
      'Błąd podczas zapisywania wyniku.': 'Błąd podczas zapisywania wyniku.',
      'Wszystkich użytkowników': 'Wszystkich użytkowników',
      'Statystyki quizu': 'Statystyki quizu',
      'Liczba podejść': 'Liczba podejść',
      'Twój czas': 'Twój czas',
      'Średni czas': 'Średni czas',
      'Powrót do quizów': 'Powrót do quizów',
      'Zobacz szczegóły quizu': 'Zobacz szczegóły quizu',
      'Powtórz hasło': 'Powtórz hasło',
      'Kolory': 'Kolory',
      'Wybierz kolor': 'Wybierz kolor',
      'Domyślna': 'Domyślna',
      'Czerwona': 'Czerwona',
      'Zielona': 'Zielona',
      'Niebieska': 'Niebieska',
      'Fioletowa': 'Fioletowa',
      'Pomarańczowa': 'Pomarańczowa',
      'Wszystkie': 'Wszystkie'
    },
    'en': {
      'Strona główna': 'Home',
      'Przeglądaj quizy': 'Browse Quizzes',
      'Utwórz quiz': 'Create Quiz',
      'Moje Quizy': 'My Quizzes',
      'Wyniki': 'Results',
      'Profil': 'Profile',
      'Zaloguj': 'Login',
      'Zarejestruj': 'Register',
      'Wyloguj': 'Logout',
      'Logowanie...': 'Logging in...',
      'Rejestracja...': 'Registering...',
      'Nowoczesna platforma e-learningowa do rozwiązywania i tworzenia quizów.': 'Modern e-learning platform for solving and creating quizzes.',
      'Ucz się, sprawdzaj wiedzę i rywalizuj z innymi!': 'Learn, test your knowledge and compete with others!',
      'Dostępne po polsku i angielsku.': 'Available in Polish and English.',
      'Utwórz własny quiz': 'Create Your Own Quiz',
      'Dostępne quizy': 'Available Quizzes',
      'Wszystkie języki': 'All Languages',
      'Polski': 'Polish',
      'Angielski': 'English',
      'Wszystkie kategorie': 'All Categories',
      'Wszystkie poziomy': 'All Levels',
      'Łatwy': 'Easy',
      'Średni': 'Medium',
      'Trudny': 'Hard',
      'Ładowanie quizów...': 'Loading quizzes...',
      'Błąd podczas pobierania quizów.': 'Error loading quizzes.',
      'Brak quizów do wyświetlenia.': 'No quizzes to display.',
      'Autor': 'Author',
      'Pytania': 'Questions',
      'Poziom': 'Level',
      'Język': 'Language',
      'Zobacz quiz': 'View Quiz',
      'Stwórz nowy quiz': 'Create New Quiz',
      'Tytuł quizu': 'Quiz Title',
      'Opis quizu': 'Quiz Description',
      'Kategoria': 'Category',
      'Poziom trudności': 'Difficulty Level',
      'Język quizu': 'Quiz Language',
      'Dodaj pytanie': 'Add Question',
      'Usuń pytanie': 'Remove Question',
      'Pytanie': 'Question',
      'Typ pytania': 'Question Type',
      'Pojedynczy wybór': 'Single Choice',
      'Wielokrotny wybór': 'Multiple Choice',
      'Opcje': 'Options',
      'Odpowiedź': 'Answer',
      'Poprawna odpowiedź': 'Correct Answer',
      'Poprawne odpowiedzi': 'Correct Answers',
      'Błąd podczas tworzenia quizu.': 'Error creating quiz.',
      'Ładowanie quizu...': 'Loading quiz...',
      'Nie znaleziono quizu.': 'Quiz not found.',
      'Liczba pytań': 'Number of Questions',
      'Rozpocznij quiz': 'Start Quiz',
      'Usuń quiz': 'Delete Quiz',
      'Usuwanie...': 'Deleting...',
      'Czy na pewno chcesz usunąć ten quiz? Tej operacji nie można cofnąć.': 'Are you sure you want to delete this quiz? This operation cannot be undone.',
      'Błąd podczas usuwania quizu.': 'Error deleting quiz.',
      'Pozostały czas': 'Time Remaining',
      'Czas minął!': 'Time\'s up!',
      'Zakończ i sprawdź wynik': 'Finish and Check Result',
      'Twój wynik': 'Your Score',
      'Czas rozwiązania': 'Solution Time',
      'sekund': 'seconds',
      'Zobacz swoje wyniki': 'View Your Results',
      'Twoje wyniki': 'Your Results',
      'Ładowanie wyników...': 'Loading results...',
      'Nie masz jeszcze żadnych wyników': 'You don\'t have any results yet',
      'Rozpocznij rozwiązywanie quizów, aby zobaczyć swoje wyniki!': 'Start solving quizzes to see your results!',
      'Wynik': 'Score',
      'Procent': 'Percentage',
      'Czas': 'Time',
      'Data': 'Date',
      'Godzina': 'Time',
      'Twój profil': 'Your Profile',
      'Nazwa użytkownika': 'Username',
      'E-mail': 'Email',
      'Quizy rozwiązane': 'Quizzes Solved',
      'Średni wynik': 'Average Score',
      'Łączny czas rozwiązywania': 'Total Solving Time',
      'Unikalnych quizów ukończonych': 'Unique Quizzes Completed',
      'Ładowanie statystyk...': 'Loading statistics...',
      'Brak statystyk do wyświetlenia.': 'No statistics to display.',
      'Nie masz jeszcze żadnych quizów': 'You don\'t have any quizzes yet',
      'Utwórz swój pierwszy quiz i udostępnij go innym!': 'Create your first quiz and share it with others!',
      'Utwórz pierwszy quiz': 'Create First Quiz',
      'Podgląd': 'Preview',
      'Utworzono': 'Created',
      'Hasło': 'Password',
      'Zaloguj się': 'Login',
      'Zarejestruj się': 'Register',
      'Nie masz konta?': 'Don\'t have an account?',
      'Masz już konto?': 'Already have an account?',
      'Zarejestruj się tutaj': 'Register here',
      'Zaloguj się tutaj': 'Login here',
      'Błąd logowania': 'Login Error',
      'Błąd rejestracji': 'Registration Error',
      'Użytkownik już istnieje': 'User already exists',
      'Nieprawidłowe dane logowania': 'Invalid login credentials',
      'Błąd': 'Error',
      'Sukces': 'Success',
      'Anuluj': 'Cancel',
      'Zapisz': 'Save',
      'Edytuj': 'Edit',
      'Tak': 'Yes',
      'Nie': 'No',
      'OK': 'OK',
      'Zamknij': 'Close',
      'Musisz być zalogowany, aby utworzyć quiz.': 'You must be logged in to create a quiz.',
      'Wypełnij wszystkie wymagane pola.': 'Fill in all required fields.',
      'Dodaj przynajmniej jedno pytanie z opcjami i poprawną odpowiedzią.': 'Add at least one question with options and correct answer.',
      'Quiz został utworzony pomyślnie!': 'Quiz created successfully!',
      'Powrót do moich quizów': 'Back to my quizzes',
      'Informacje o quizie': 'Quiz information',
      'Wprowadź tytuł quizu': 'Enter quiz title',
      'Wprowadź opis quizu': 'Enter quiz description',
      'np. Geografia, Historia, Nauka': 'e.g. Geography, History, Science',
      'Limit czasu (sekundy)': 'Time limit (seconds)',
      'Wprowadź pytanie': 'Enter question',
      'Opcja': 'Option',
      'Wybierz poprawną odpowiedź': 'Select correct answer',
      'Zapisywanie...': 'Saving...',
      'Zapisz quiz': 'Save quiz',
      'Podejścia': 'Attempts',
      'Poprzednie': 'Previous',
      'Następne': 'Next',
      'Musisz być zalogowany, aby zapisać wynik.': 'You must be logged in to save the result.',
      'Błąd podczas zapisywania wyniku.': 'Error saving result.',
      'Wszystkich użytkowników': 'All users',
      'Statystyki quizu': 'Quiz statistics',
      'Liczba podejść': 'Number of attempts',
      'Twój czas': 'Your time',
      'Średni czas': 'Average time',
      'Powrót do quizów': 'Back to quizzes',
      'Zobacz szczegóły quizu': 'View quiz details',
      'Powtórz hasło': 'Repeat password',
      'Kolory': 'Colors',
      'Wybierz kolor': 'Choose color',
      'Domyślna': 'Default',
      'Czerwona': 'Red',
      'Zielona': 'Green',
      'Niebieska': 'Blue',
      'Fioletowa': 'Purple',
      'Pomarańczowa': 'Orange',
      'Wszystkie': 'All'
    }
  };

  const translateText = async (text, targetLang) => {
    if (!text || targetLang === 'pl') return text;
    
    // Sprawdź cache
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    try {
      const response = await axios.post('/api/translate', {
        text,
        targetLanguage: targetLang
      });
      const translatedText = response.data.translatedText;
      
      // Zapisz w cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Zwróć oryginalny tekst w przypadku błędu
    }
  };

  const changeLanguage = async (newLanguage) => {
    if (newLanguage === currentLanguage) return;
    
    setIsLoading(true);
    try {
      setCurrentLanguage(newLanguage);
      localStorage.setItem('appLanguage', newLanguage);
      setUpdateKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Language change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key) => {
    return staticTranslations[currentLanguage]?.[key] || staticTranslations['pl']?.[key] || key;
  };

  useEffect(() => {
    // Sprawdź zapisany język lub ustaw polski jako domyślny
    let savedLanguage = localStorage.getItem('appLanguage');
    const supported = availableLanguages.map(l => l.code);
    if (!savedLanguage || !supported.includes(savedLanguage)) {
      savedLanguage = 'pl';
      localStorage.setItem('appLanguage', 'pl');
    }
    setCurrentLanguage(savedLanguage);
    setIsLoading(false);
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    availableLanguages,
    updateKey
  };

  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: 40}}>Ładowanie tłumaczeń...</div>;
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}; 