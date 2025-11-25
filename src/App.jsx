import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import TrackHabits from './pages/TrackHabits'
import ManageHabits from './pages/ManageHabits'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-container d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/habits"
            element={
              <ProtectedRoute>
                <TrackHabits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-habits"
            element={
              <ProtectedRoute>
                <ManageHabits />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
