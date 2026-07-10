import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./Contexts/AuthProvider";
import Dashboard from "./Components/Pages/Dashboard";
import Upcoming from "./Components/Features/Upcoming";
import Profile from "./Components/Pages/Profile";
import Notif from "./Components/Pages/Notif";
import Wallet from "./Components/Pages/Wallet";
import Login from "./Components/Admin/Login";
import ProtectedRoute from "./Components/Layout/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upcoming"
            element={
              <ProtectedRoute>
                <Upcoming />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notif />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
