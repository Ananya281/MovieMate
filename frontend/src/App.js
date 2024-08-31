import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SelectMoviesPage from "./pages/SelectMoviesPage";
import SelectActorsPage from "./pages/SelectActorsPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CategoriesPage from "./pages/CategoriesPage";
import MovieDetail from "./pages/MovieDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/select-movies" element={<SelectMoviesPage />} />
        <Route path="/select-actors" element={<SelectActorsPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/moviedetail/:title" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}

export default App;