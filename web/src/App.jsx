import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router"
import Header from './components/Header';
import Home from "./components/Home"
import Manga from "./components/Manga"
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import authRequired from './authRequired';
import Login from './components/Login'
import './App.css'


const ProtectedHome = authRequired(Home);
const ProtectedManga = authRequired(Manga);

function App() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogout = () => {

    localStorage.removeItem("jwt-token");
    setIsAuthenticated(false);

    navigate("/sign-in");

  }


  const handleLogin = () => {

    setIsAuthenticated(true);
    navigate("/manga");

  }


  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt-token");

    if (jwtToken) {
      setIsAuthenticated(true);
    }

  }, []);

  return (
    <>
      <Header handleLogout={handleLogout} isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in"
          element={<SignIn handleLogin={handleLogin} />} />
        <Route path="/manga" element={<ProtectedHome />} />
        <Route path="/manga/:id" element={<ProtectedManga />} />
      </Routes>
    </>
  )
}

export default App
