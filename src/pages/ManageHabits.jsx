import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { habitsAPI } from '../services/api';

const ICONS = ['📱', '🧘', '📚', '💪', '🏃', '💧', '🎯', '✍️', '🎨', '🎵', '🌱', '☕'];
const COLORS = ['#d60036', '#f2ad78', '#00d4ff', '#7c3aed', '#10b981', '#f59e0b'];

function ManageHabits() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  if (loading) {
    return (
      <Container className="page-content text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="page-content">
      <div className="text-center mb-5">
        <h1 className="neon-text mb-3">Zarządzaj Nawykami 🎯</h1>
        <p style={{ color: '#f2ad78', fontSize: '1.1rem' }}>
          Dodawaj, edytuj i usuwaj swoje mikro nawyki
        </p>
        <button 
          className="btn-futuristic mt-3"
          onClick={() => handleShowModal()}
        >
          ➕ Dodaj Nawyk
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center" style={{ color: '#f2ad78' }}>
          <p>Nie masz jeszcze żadnych nawyków. Dodaj pierwszy!</p>
        </div>
      ) : (
        <Row className="g-4">
          {habits.map((habit) => (
            <Col key={habit.id} xs={12} md={6} lg={4}>
              <div 
                className="futuristic-card p-4"
                style={{ 
                  borderColor: habit.color,
                  position: 'relative'
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '15px', 
                  right: '15px',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => handleShowModal(habit)}
                    style={{
                      background: 'rgba(242, 173, 120, 0.2)',
                      border: '1px solid #f2ad78',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    style={{
                      background: 'rgba(214, 0, 54, 0.2)',
                      border: '1px solid #d60036',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {habit.icon}
                </div>
                
                <h4 style={{ color: '#f2ad78', marginBottom: '0.5rem', fontWeight: '700' }}>
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
              background: 'transparent',
              border: 'none',
              color: '#f2ad78',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </Modal.Header>
        <Modal.Body style={{ background: 'transparent' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nazwa nawyku</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="np. Medytacja"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Opis (opcjonalnie)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Krótki opis nawyku..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Czas trwania (minuty)</Form.Label>
              <Form.Control
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Wybierz ikonę</Form.Label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    style={{
                      fontSize: '2rem',
                      padding: '10px',
                      background: formData.icon === icon ? 'rgba(214, 0, 54, 0.3)' : 'transparent',
                      border: formData.icon === icon ? '2px solid #d60036' : '1px solid rgba(242, 173, 120, 0.3)',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Wybierz kolor</Form.Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: color,
                      border: formData.color === color ? '3px solid white' : 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: formData.color === color ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            <div className="d-flex gap-2">
              <button type="submit" className="btn-futuristic flex-grow-1">
                {currentHabit ? '💾 Zapisz' : '➕ Dodaj'}
              </button>
              <button 
                type="button" 
                className="btn-futuristic flex-grow-1"
                style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }}
                onClick={handleCloseModal}
              >
                ❌ Anuluj
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ManageHabits;
