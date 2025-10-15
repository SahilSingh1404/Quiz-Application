import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlayerForm from "./components/PlayerForm";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayerForm />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
