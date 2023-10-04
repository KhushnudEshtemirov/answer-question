import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import HomePage from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
