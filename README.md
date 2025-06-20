# QuizMaster

Nowoczesna aplikacja E-learningowa do tworzenia, rozwiązywania i zarządzania quizami. 

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
- Tworzenie, edycja i usuwanie własnych quizów
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
- **Backend:** Node.js, Express, SQLite
- **Inne:** JWT (autoryzacja), bcryptjs (hasła)

## Struktura projektu
```
quizmaster/
  client/         # Frontend React
    src/
      components/ # Komponenty UI (Navbar, itp.)
      context/    # Konteksty (Auth, Kolory, Tłumaczenia)
      pages/      # Widoki/strony (Quizy, Wyniki, Profil, itp.)
      index.js    # Entry point
      App.js      # Routing
    public/       # index.html, manifest
    package.json  # Zależności frontu
  server/         # Backend Node.js/Express
    index.js      # Serwer API
    database.js   # Logika bazy SQLite
    quiz_app.db   # Baza danych
    package.json  # Zależności backendu
```

## Instalacja i uruchomienie
1. **Klonuj repozytorium:**
   ```
   git clone <adres-repo>
   cd zaliczenie
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
   cd ../client
   npm start
   ```
   (aplikacja dostępna na http://localhost:3000)

## Instrukcja użytkownika
- **Rejestracja/logowanie:** Załóż konto, zaloguj się.
- **Tworzenie quizu:** Przejdź do "Utwórz quiz", wypełnij formularz, dodaj pytania, zapisz.
- **Przeglądanie quizów:** Wybierz "Przeglądaj quizy", filtruj wg kategorii, poziomu, języka.
- **Rozwiązywanie quizu:** Kliknij "Zobacz quiz" → "Rozpocznij quiz". Po zakończeniu zobaczysz wynik.
- **Wyniki i statystyki:** Przejdź do "Wyniki" lub "Profil".
- **Zmiana języka/motywu:** Użyj przycisków w prawym górnym rogu (lub w menu mobilnym).

## Autor
Aplikacja stworzona przez Mateusza Toporka w ramach zaliczenia przedmiotu "Serwisy E-learningowe 2.0". 