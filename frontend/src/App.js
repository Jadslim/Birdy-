import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" 
            element={
                <LoginPage />  
          }/>
        </Routes>
        <Routes>
          <Route path="/register" 
            element={  
                <RegisterPage />  
          }/>
        </Routes>
        <Routes>
          <Route path="/home" 
            element={  
              <PrivateRoute>
                <HomePage />  
              </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
