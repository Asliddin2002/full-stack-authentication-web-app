import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthPages from "./pages/authentication/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <>
              <AuthPages />
            </>
          }
          path="auth"
        />
        <Route element={<>Home Page</>} path="/" />
      </Routes>
    </Router>
  );
}

export default App;
