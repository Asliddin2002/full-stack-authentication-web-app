import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthPages from "./pages/authentication/AuthPage";
import RootRedirect from "./lib/route-guard/RootRedirect";
import PrivateRoute from "./lib/route-guard/PrivateRoute";
import PublicRoute from "./lib/route-guard/PublicRoute";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthPages />} path="/auth" />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<ProfilePage />} path="/" />
        </Route>
        <Route element={<RootRedirect />} path="*" />
      </Routes>
    </Router>
  );
}

export default App;
