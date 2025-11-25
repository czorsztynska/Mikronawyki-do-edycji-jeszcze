import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="navbar-futuristic">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <Link to="/" className="neon-text fw-bold" style={{ 
          fontSize: '1.5rem', 
          textDecoration: 'none',
          fontWeight: 900,
          letterSpacing: '2px'
        }}>
          💎 MicroHabits
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#f2ad78', textDecoration: 'none', fontWeight: 600 }}>
            🏠 Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/habits" style={{ color: '#f2ad78', textDecoration: 'none', fontWeight: 600 }}>
                ✅ Nawyki
              </Link>
              <Link to="/manage-habits" style={{ color: '#f2ad78', textDecoration: 'none', fontWeight: 600 }}>
                ⚙️ Zarządzaj
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <span style={{ color: '#f2ad78', fontWeight: 600 }}>
                👤 {user?.name}
              </span>
              <button
                className="btn-futuristic"
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                onClick={logout}
              >
                🚪 Wyloguj
              </button>
            </>
          ) : (
            <button
              className="btn-futuristic"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              onClick={() => window.location.href = '/login'}
            >
              🔓 Zaloguj się
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
