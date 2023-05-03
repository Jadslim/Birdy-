import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';
import FavouritesPage from './pages/FavouritePage';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" 
            element={
                <LoginPage />  
          }/>
          <Route path="/register" 
            element={  
                <RegisterPage />  
          }/>
          <Route path="/home" 
            element={  
              <PrivateRoute>
                <HomePage />  
              </PrivateRoute>
          }/>
          <Route path="/profile/:profile_id" 
            element={  
              <PrivateRoute>
                <ProfilePage />  
              </PrivateRoute>
          }/>
          <Route path="/stats" 
            element={  
              <PrivateRoute>
                <StatsPage />  
              </PrivateRoute>
          }/>
          <Route path="/favourites" 
            element={  
              <PrivateRoute>
                <FavouritesPage />  
              </PrivateRoute>
          }/>
          <Route path="*" element={<Navigate to="/home" />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
