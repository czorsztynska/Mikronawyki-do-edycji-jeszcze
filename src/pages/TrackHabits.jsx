import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { habitsAPI } from "../services/api";

function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [habitData, setHabitData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [completingHabit, setCompletingHabit] = useState(null);
  const [celebrationHabit, setCelebrationHabit] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      fetchAllHabitData();
    }
  }, [habits, selectedMonth]);

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

  const fetchAllHabitData = async () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const dataPromises = habits.map(async (habit) => {
      try {
        const response = await habitsAPI.getCalendar(habit.id, year, month);
        return { habitId: habit.id, data: response.data };
      } catch (error) {
        console.error(`Error fetching calendar for habit ${habit.id}:`, error);
        return {
          habitId: habit.id,
          data: { completions: [], currentStreak: 0, maxStreak: 0 },
        };
      }
    });

    const results = await Promise.all(dataPromises);
    const dataMap = {};
    results.forEach((result) => {
      dataMap[result.habitId] = result.data;
    });
    setHabitData(dataMap);
  };

  const handleComplete = async (habitId) => {
    setCompletingHabit(habitId);
    try {
      const response = await habitsAPI.complete(habitId);

      setCelebrationHabit(habitId);
      setTimeout(() => setCelebrationHabit(null), 2000);

      // Force refresh - wait for both to complete
      await Promise.all([fetchHabits(), fetchAllHabitData()]);
      
    } catch (error) {
      console.error("Error completing habit:", error);
      await Promise.all([fetchHabits(), fetchAllHabitData()]);
    } finally {
      setCompletingHabit(null);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderCalendar = (habit) => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(selectedMonth);
    const today = new Date();
    const days = [];

    const calendarData = habitData[habit.id];
    const completions = calendarData?.completions || [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: "8px" }}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isFuture = date > today;

      const isCompleted = completions.includes(dateStr);

      days.push(
        <div
          key={day}
          style={{
            padding: "8px",
            textAlign: "center",
            borderRadius: "8px",
            background: isCompleted
              ? "rgba(16, 185, 129, 0.3)"
              : isToday
              ? "rgba(214, 0, 54, 0.2)"
              : isFuture
              ? "rgba(108, 117, 125, 0.1)"
              : "transparent",
            border: isCompleted
              ? "2px solid #10b981"
              : isToday
              ? "2px solid #d60036"
              : "1px solid rgba(242, 173, 120, 0.2)",
            color: isFuture ? "#6c757d" : "#f2ad78",
            fontWeight: isToday ? "700" : "400",
            cursor: isFuture ? "not-allowed" : "default",
            opacity: isFuture ? 0.4 : 1,
          }}
        >
          {day}
          {isCompleted && <div style={{ fontSize: "0.7rem" }}>✅</div>}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedMonth(newDate);
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
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
        <h1 className="neon-text mb-3">Moje Nawyki 🎯</h1>
        <p style={{ color: "#f2ad78", fontSize: "1.1rem" }}>
          Wykonuj swoje nawyki i śledź postępy
        </p>
      </div>

      {/* Month Selector */}
      <div
        className="futuristic-card p-3 mb-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "500px",
          margin: "0 auto 2rem",
        }}
      >
        <button
          className="btn-futuristic"
          style={{ padding: "8px 16px", fontSize: "1rem" }}
          onClick={() => changeMonth(-1)}
        >
          ◀
        </button>
        <h3
          style={{ color: "#f2ad78", margin: 0, textTransform: "capitalize" }}
        >
          {getMonthName(selectedMonth)}
        </h3>
        <button
          className="btn-futuristic"
          style={{ padding: "8px 16px", fontSize: "1rem" }}
          onClick={() => changeMonth(1)}
        >
          ▶
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center" style={{ color: "#f2ad78" }}>
          <p>Nie masz jeszcze żadnych nawyków.</p>
          <button
            className="btn-futuristic mt-3"
            onClick={() => (window.location.href = "/manage-habits")}
          >
            ➕ Dodaj pierwszy nawyk
          </button>
        </div>
      ) : (
        <div>
          {habits.map((habit) => {
            const isCompleting = completingHabit === habit.id;
            const isCelebrating = celebrationHabit === habit.id;
            
            // Check if completed today using calendar data
            const today = new Date().toISOString().split('T')[0];
            const calendarData = habitData[habit.id];
            const completedToday = calendarData?.completions?.includes(today) || habit.completed_today;

            return (
              <div
                key={habit.id}
                className="futuristic-card p-4 mb-4"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  transform: isCelebrating ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Celebration overlay */}
                {isCelebrating && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
                      animation: "celebration-pulse 1s ease-out",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      flex: "1 1 auto",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2.5rem",
                        transition: "transform 0.3s ease",
                        transform: isCelebrating
                          ? "scale(1.3) rotate(10deg)"
                          : "scale(1)",
                      }}
                    >
                      {habit.icon}
                    </div>
                    <div style={{ flex: "1 1 auto" }}>
                      <h4
                        style={{
                          color: "#f2ad78",
                          margin: 0,
                          fontWeight: "700",
                        }}
                      >
                        {habit.name}
                      </h4>
                      <p
                        style={{
                          color: "#ccc",
                          fontSize: "0.9rem",
                          margin: "0.25rem 0 0",
                        }}
                      >
                        ⏱️ {habit.duration_minutes} min
                      </p>
                      {/* DEBUG: {JSON.stringify({ id: habit.id, completed_today: habit.completed_today })} */}
                      {habit.completed_today && (
                        <p
                          style={{
                            color: "#10b981",
                            fontSize: "0.85rem",
                            margin: "0.25rem 0 0",
                            fontWeight: "600",
                          }}
                        >
                          ✅ Wykonane dzisiaj!
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn-futuristic"
                    style={{
                      padding: "12px 28px",
                      fontSize: "1rem",
                      background: habit.completed_today
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : isCompleting
                        ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
                        : "linear-gradient(135deg, #d60036 0%, #a8002a 100%)",
                      cursor: habit.completed_today
                        ? "default"
                        : isCompleting
                        ? "wait"
                        : "pointer",
                      position: "relative",
                      transition: "all 0.3s ease",
                      minWidth: "200px",
                    }}
                    onClick={() =>
                      !completedToday &&
                      !isCompleting &&
                      handleComplete(habit.id)
                    }
                    disabled={completedToday || isCompleting}
                  >
                    {isCompleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Zapisywanie...
                      </>
                    ) : completedToday ? (
                      <>✅ Wykonano Dziś</>
                    ) : (
                      <>🎯 Wykonaj Dziś</>
                    )}
                  </button>
                </div>

                {/* Calendar Grid */}
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"].map(
                      (day, idx) => (
                        <div
                          key={idx}
                          style={{
                            textAlign: "center",
                            color: "#f2ad78",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {renderCalendar(habit)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

export default Habits;
