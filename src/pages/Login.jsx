import { useState } from 'react';
import { Container, Form, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (password !== confirmPassword) {
        return setError('Hasła nie są identyczne');
      }
      if (password.length < 6) {
        return setError('Hasło musi mieć minimum 6 znaków');
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || `Błąd podczas ${isLogin ? 'logowania' : 'rejestracji'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="futuristic-card p-5">
              <div className="text-center mb-4">
                <h1 className="neon-text mb-3">
                  {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
                </h1>
                <p style={{ color: '#f2ad78' }}>
                  {isLogin ? 'Witaj z powrotem!' : 'Zacznij budować nawyki'}
                </p>
              </div>

              {error && (
                <Alert 
                  variant="danger" 
                  style={{ 
                    background: 'rgba(214, 0, 54, 0.2)',
                    border: '1px solid #d60036',
                    color: '#fff'
                  }}
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  {!isLogin && (
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Imię i nazwisko</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Wprowadź imię i nazwisko"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="twoj@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={isLogin ? 12 : 6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hasło</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Minimum 6 znaków"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </Form.Group>
                  </Col>

                  {!isLogin && (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Potwierdź hasło</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Wprowadź ponownie"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required={!isLogin}
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                <button
                  type="submit"
                  className="btn-futuristic w-100 mb-3"
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
                >
                  {loading 
                    ? (isLogin ? 'Logowanie...' : 'Rejestracja...') 
                    : (isLogin ? '🔓 Zaloguj się' : '🚀 Zarejestruj się')
                  }
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f2ad78',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {isLogin 
                      ? 'Nie masz konta? Zarejestruj się' 
                      : 'Masz już konto? Zaloguj się'
                    }
                  </button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
