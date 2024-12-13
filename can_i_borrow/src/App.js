import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import AppLoader from './components/tools/AppLoader';
import HomePageWindow from './components/homepage/HomePageWindow';
import RegisterPage from './components/tools/RegisterPage';
import LoginPage from './components/tools/LoginPage';
import 'react-datepicker/dist/react-datepicker.css';

function App() {

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      selectedTheme ? 'light' : 'dark'
    );
  }, [selectedTheme]);



  return (
    <BrowserRouter>
      <div className="d-flex flex-column justify-content-center align-items-center position-relative vh-100">
        {/* <div className='big-half' /> */}
        <Routes>
          <Route path="/" element={  <AppLoader progress={progress} isLoaded={isLoaded} setIsLoaded={setIsLoaded}/>} />
          <Route path="/homepage/*" element={ <HomePageWindow progress={progress} isLoaded={isLoaded} setIsLoaded={setIsLoaded} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
