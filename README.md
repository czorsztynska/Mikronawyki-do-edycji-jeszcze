# Projekt Vite + React + PostgreSQL

Aplikacja Full-Stack z React (Vite), Bootstrap, SCSS i PostgreSQL.

## 🚀 Technologie

### Frontend
- **Vite** - Build tool
- **React** - Biblioteka UI
- **React Router** - Routing
- **Bootstrap 5** + **react-bootstrap** - Komponenty UI
- **SCSS** - Style
- **Axios** - HTTP client

### Backend
- **Node.js** + **Express** - Serwer API
- **PostgreSQL** - Baza danych
- **pg** - PostgreSQL client
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Zmienne środowiskowe

## 📋 Wymagania

- Node.js (v16+)
- PostgreSQL (v12+)
- npm lub yarn

## 🛠️ Instalacja

### 1. Sklonuj repozytorium i zainstaluj zależności

```bash
npm install
```

### 2. Skonfiguruj bazę danych PostgreSQL

#### Zainstaluj PostgreSQL (jeśli jeszcze nie masz)
- Windows: Pobierz z https://www.postgresql.org/download/
- Zapamiętaj hasło dla użytkownika `postgres`

#### Utwórz bazę danych

Otwórz **pgAdmin** lub terminal PostgreSQL i wykonaj:

```bash
psql -U postgres -f database/init.sql
```

Lub ręcznie w psql:

```sql
CREATE DATABASE projekt_db;
\c projekt_db

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
  ('Jan Kowalski', 'jan.kowalski@example.com'),
  ('Anna Nowak', 'anna.nowak@example.com'),
  ('Piotr Wiśniewski', 'piotr.wisniewski@example.com');
```

### 3. Skonfiguruj zmienne środowiskowe

Skopiuj `.env.example` do `.env` i uzupełnij danymi:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=twoje_haslo
DB_NAME=projekt_db

PORT=5000
```

## 🚀 Uruchomienie

### Uruchom backend (serwer API)

```bash
npm run server:dev
```

Serwer uruchomi się na: `http://localhost:5000`

### Uruchom frontend (React)

W nowym terminalu:

```bash
npm run dev
```

Aplikacja będzie dostępna na: `http://localhost:5173`

## 📁 Struktura projektu

```
projekt/
├── src/                    # Frontend (React)
│   ├── components/         # Komponenty React
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/             # Strony
│   │   ├── Home.jsx
│   │   ├── Users.jsx      # Zarządzanie użytkownikami (CRUD)
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── styles/            # Style SCSS
│   │   └── main.scss
│   ├── App.jsx
│   └── main.jsx
├── server/                # Backend (Express)
│   ├── config/
│   │   └── database.js    # Konfiguracja PostgreSQL
│   ├── controllers/
│   │   └── usersController.js
│   ├── routes/
│   │   └── users.js
│   └── server.js          # Główny plik serwera
├── database/              # SQL scripts
│   └── init.sql
├── .env                   # Zmienne środowiskowe
└── package.json
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Sprawdza połączenie z bazą danych

### Users (CRUD)
- `GET /api/users` - Pobierz wszystkich użytkowników
- `GET /api/users/:id` - Pobierz użytkownika po ID
- `POST /api/users` - Utwórz nowego użytkownika
- `PUT /api/users/:id` - Zaktualizuj użytkownika
- `DELETE /api/users/:id` - Usuń użytkownika

## 🎯 Funkcjonalności

### Strona główna (Home)
- Prezentacja technologii
- Responsywne karty z Bootstrap

### Zarządzanie użytkownikami (Users)
- ✅ Lista użytkowników z bazy danych
- ✅ Dodawanie nowych użytkowników
- ✅ Edycja użytkowników
- ✅ Usuwanie użytkowników
- ✅ Pełna walidacja formularzy

### O nas (About)
- Informacje o projekcie

### Kontakt (Contact)
- Formularz kontaktowy

## 🧪 Testowanie API

Możesz przetestować API używając curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Pobierz użytkowników
curl http://localhost:5000/api/users

# Dodaj użytkownika
curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\"}"
```

## 🐛 Troubleshooting

### Błąd połączenia z bazą danych
1. Sprawdź czy PostgreSQL jest uruchomiony
2. Zweryfikuj dane w pliku `.env`
3. Sprawdź czy baza `projekt_db` istnieje

### Port już zajęty
Zmień port w `.env` (backend) lub `vite.config.js` (frontend)

