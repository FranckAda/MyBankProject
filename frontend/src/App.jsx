import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Pages/Dashboard";
import Upcoming from "./Components/Features/Upcoming";
import Profile from "./Components/Pages/Profile";
import Notif from "./Components/Pages/Notif";
import Wallet from "./Components/Pages/Wallet";
function App() {
  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error fetching health:", error));
  });
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notif/>}/>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
