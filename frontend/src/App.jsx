import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import ExpenseForm from "./Components/ExpenseForm";
import ExpenseList from "./Components/ExpenseList";
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
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<ExpenseForm />} />
        <Route path="/expenlist" element={<ExpenseList />} />
      </Routes>
    </Router>
  );
}

export default App;
