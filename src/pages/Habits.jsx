import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { habitsAPI } from '../services/api';

const ICONS = ['📱', '🧘', '📚', '💪', '🏃', '💧', '🎯', '✍️', '🎨', '🎵', '🌱', '☕'];
const COLORS = ['#d60036', '#f2ad78', '#00d4ff', '#7c3aed', '#10b981', '#f59e0b'];

function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentHabit, setCurrentHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 10,
    icon: '📱',
    color: '#d60036'
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await habitsAPI.getAll();
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (habit = null) => {
    if (habit) {
      setCurrentHabit(habit);
      setFormData({
        name: habit.name,
        description: habit.description || '',
        duration_minutes: habit.duration_minutes,
        icon: habit.icon,
        color: habit.color
      });
    } else {
      setCurrentHabit(null);
      setFormData({
        name: '',
        description: '',
        duration_minutes: 10,
        icon: '📱',
        color: '#d60036'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentHabit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentHabit) {
        await habitsAPI.update(currentHabit.id, formData);
      } else {
        await habitsAPI.create(formData);
      }
      fetchHabits();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten nawyk?')) {
      try {
        await habitsAPI.delete(id);
        fetchHabits();
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await habitsAPI.complete(id);
      if (response.data.message) {
        // Already completed today
        alert('✅ ' + response.data.message);
      }
      fetchHabits();
    } catch (error) {
      if (error.response?.data?.message) {
        alert('ℹ️ ' + error.response.data.message);
      } else {
        console.error('Error completing habit:', error);
      }
    }
  };

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
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="neon-text mb-2">Moje Nawyki 🎯</h1>
            <p style={{ color: '#f2ad78' }}>Zarządzaj swoimi mikro nawykami</p>
          </div>
          <button className="btn-futuristic" onClick={() => handleShowModal()}>
            ➕ Dodaj Nawyk
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="futuristic-card p-5 text-center">
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ color: '#f2ad78', marginBottom: '1rem' }}>
              Brak nawyków
            </h3>
            <p style={{ color: '#ccc', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto' }}>
              Zacznij budować lepsze nawyki! Dodaj swój pierwszy mikro nawyk i śledź swój postęp każdego dnia.
            </p>
            <button className="btn-futuristic mt-3" onClick={() => handleShowModal()}>
              Dodaj Pierwszy Nawyk
            </button>
          </div>
        ) : (
          <Row className="g-4">
            {habits.map((habit) => (
              <Col md={6} lg={4} key={habit.id}>
                <div className="habit-card" style={{ borderColor: habit.color + '50' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{ fontSize: '3rem' }}>{habit.icon}</div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          background: 'rgba(242, 173, 120, 0.2)',
                          border: 'none',
                          color: '#f2ad78',
                          borderRadius: '8px'
                        }}
                        onClick={() => handleShowModal(habit)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: 'rgba(214, 0, 54, 0.2)',
                          border: 'none',
                          color: '#d60036',
                          borderRadius: '8px'
                        }}
                        onClick={() => handleDelete(habit.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h4 style={{ color: '#f2ad78', marginBottom: '0.5rem' }}>
                    {habit.name}
                  </h4>
                  {habit.description && (
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      {habit.description}
                    </p>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                      ⏱️ {habit.duration_minutes} min
                    </span>
                    <span style={{ color: habit.color, fontWeight: '700' }}>
                      Kolor: <span style={{ 
                        display: 'inline-block', 
                        width: '20px', 
                        height: '20px', 
                        background: habit.color,
                        borderRadius: '50%',
                        verticalAlign: 'middle'
                      }}></span>
                    </span>
                  </div>

                  <button
                    className="btn-futuristic w-100"
                    style={{ 
                      padding: '10px',
                      opacity: habit.completed_today ? 0.6 : 1,
                      cursor: habit.completed_today ? 'default' : 'pointer'
                    }}
                    onClick={() => handleComplete(habit.id)}
                    disabled={habit.completed_today}
                  >
                    {habit.completed_today ? '✅ Wykonano Dziś' : '✅ Wykonaj Dziś'}
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal */}
        <Modal 
          show={showModal} 
          onHide={handleCloseModal}
          centered
          contentClassName="futuristic-card"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        >
          <Modal.Header style={{ borderBottom: '1px solid rgba(242, 173, 120, 0.3)', background: 'transparent' }}>
            <Modal.Title style={{ color: '#f2ad78' }}>
              {currentHabit ? 'Edytuj Nawyk' : 'Nowy Nawyk'}
            </Modal.Title>
            <button
              onClick={handleCloseModal}
              style={{
                background: 'none',
                border: 'none',
                color: '#f2ad78',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body style={{ background: 'transparent' }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nazwa nawyku</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="np. Odkładanie telefonu"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Opis (opcjonalnie)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Krótki opis nawyku"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Czas trwania (minuty)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Wybierz ikonę</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <div
                      key={icon}
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Wybierz kolor</Form.Label>
                <div className="d-flex gap-3">
                  {COLORS.map((color) => (
                    <div
                      key={color}
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </Form.Group>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn-futuristic btn-secondary-futuristic flex-fill"
                  onClick={handleCloseModal}
                >
                  Anuluj
                </button>
                <button type="submit" className="btn-futuristic flex-fill">
                  {currentHabit ? 'Zapisz' : 'Dodaj'}
                </button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default Habits;