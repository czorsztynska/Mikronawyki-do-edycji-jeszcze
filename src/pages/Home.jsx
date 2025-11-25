import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { habitsAPI } from '../services/api';

function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [streaks, setStreaks] = useState([]);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreaks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilReset(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchStreaks = async () => {
    try {
      const response = await habitsAPI.getAllStreaks();
      setStreaks(response.data);
    } catch (error) {
      console.error('Error fetching streaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStreak = streaks.reduce((sum, habit) => sum + habit.streak, 0);
  const maxStreak = Math.max(...streaks.map(h => h.streak), 0);
  const completedToday = streaks.filter(h => h.completed_today).length;

  if (!isAuthenticated) {
    return (
      <div className="page-content">
        <Container>
          <div className="text-center">
            <div className="floating mb-5">
              <h1 className="display-1 neon-text mb-4">MicroHabits</h1>
              <p className="lead" style={{ color: '#f2ad78', fontSize: '1.5rem' }}>
                Buduj lepsze nawyki, jeden dzień na raz
              </p>
            </div>
            
            <Row className="mt-5 g-4">
              <Col md={4}>
                <div className="futuristic-card p-4 h-100">
                  <div style={{ fontSize: '3rem' }}>🎯</div>
                  <h3 className="mt-3" style={{ color: '#f2ad78' }}>Śledzenie Nawyków</h3>
                  <p style={{ color: '#ccc' }}>
                    Monitoruj swoje mikro nawyki i buduj streaki
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="futuristic-card p-4 h-100">
                  <div style={{ fontSize: '3rem' }}>💎</div>
                  <h3 className="mt-3" style={{ color: '#f2ad78' }}>Streaki</h3>
                  <p style={{ color: '#ccc' }}>
                    Utrzymuj codzienne streaki i osiągaj cele
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="futuristic-card p-4 h-100">
                  <div style={{ fontSize: '3rem' }}>📊</div>
                  <h3 className="mt-3" style={{ color: '#f2ad78' }}>Progress</h3>
                  <p style={{ color: '#ccc' }}>
                    Zobacz swój postęp i motywację
                  </p>
                </div>
              </Col>
            </Row>

            <div className="mt-5">
              <button 
                className="btn-futuristic me-3"
                onClick={() => navigate('/login')}
              >
                Zaloguj się
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <Container className="page-content text-center">
        <div className="spinner-futuristic mx-auto"></div>
      </Container>
    );
  }

  return (
    <div className="page-content">
      <Container>
        <div className="text-center mb-5">
          <h1 className="neon-text mb-3">Witaj, {user?.name}! 👋</h1>
          <p style={{ color: '#f2ad78', fontSize: '1.2rem' }}>
            Kontynuuj swoje nawyki i utrzymuj streaki
          </p>
        </div>

        {/* Countdown Timer */}
        <Row className="mb-5">
          <Col lg={12}>
            <div className="countdown-timer">
              <div style={{ fontSize: '1rem', color: '#f2ad78', marginBottom: '0.5rem' }}>
                ⏰ Czas do resetowania streaków
              </div>
              <div className="neon-text">{timeUntilReset}</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '0.5rem' }}>
                Wykonaj swoje nawyki przed końcem dnia!
              </div>
            </div>
          </Col>
        </Row>

        {/* Habits List */}
        <div className="mb-4">
          <h2 style={{ color: '#f2ad78' }}>Twoje Nawyki 📝</h2>
        </div>

        {streaks.length === 0 ? (
          <div className="futuristic-card p-5 text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ color: '#f2ad78' }}>Brak nawyków</h3>
            <p style={{ color: '#ccc', marginBottom: '2rem' }}>
              Dodaj swój pierwszy nawyk i zacznij budować streaki!
            </p>
            <button 
              className="btn-futuristic"
              onClick={() => navigate('/habits')}
            >
              Dodaj Nawyk
            </button>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {streaks.map((habit) => (
                <Col md={6} lg={4} key={habit.id}>
                  <div className={`habit-card ${habit.completed_today ? 'completed' : ''}`}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div style={{ fontSize: '2.5rem' }}>{habit.icon}</div>
                    </div>
                    <h4 style={{ color: '#f2ad78', marginBottom: '0.5rem' }}>{habit.name}</h4>
                    <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                      {habit.completed_today ? (
                        <span style={{ color: '#4ade80' }}>✅ Wykonane dziś</span>
                      ) : (
                        <span style={{ color: '#fbbf24' }}>⏳ Oczekuje</span>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            
            <div className="text-center mt-4">
              <button 
                className="btn-futuristic"
                onClick={() => navigate('/habits')}
              >
                Zarządzaj Nawykami
              </button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;
