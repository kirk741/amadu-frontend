import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/ui/Layout/Layout';
import { useEffect, useState } from 'react';
import RegisterPage from './pages/AuthPages/RegisterPage/RegisterPage';
import LoginPage from './pages/AuthPages/LoginPage/LoginPage';
import HomePage from './pages/ClientPages/HomePage/HomePage';
import EmotionLogsPage from './pages/ClientPages/EmotionLogsPage/EmotionLogsPage';
import PsychologistsPage from './pages/ClientPages/PsychologistsPage/PsychologistsPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import DiariesPage from './pages/ClientPages/DiaryPages/DiariesPage/DiariesPage';
import CreateDiaryPage from './pages/ClientPages/DiaryPages/CreateDiaryPage/CreateDiaryPage';
import EditDiaryPage from './pages/ClientPages/DiaryPages/EditDiaryPage/EditDiaryPage';
import TrashDiaryPage from './pages/ClientPages/DiaryPages/TrashDiaryPage/TrashDiaryPage';
import BreathingPage from './pages/ClientPages/BreathingPage/BreathingPage';
import GroundingPage from './pages/ClientPages/GroundingPage/GroundingPage';
import KalimbaPage from './pages/ClientPages/KalimbaPage/KalimbaPage';
import PhonesPage from './pages/ClientPages/PhonePages/PhonesPage/PhonesPage';
import PhoneDetailsPage from './pages/ClientPages/PhonePages/PhoneDetailsPage/PhoneDetailsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = savedTheme;

    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/user/:id' element={<UserProfilePage />} />

          {role === 'client' && (
            <>
              <Route path='/' element={<HomePage />} />
              <Route path='/emotion-logs' element={<EmotionLogsPage />} />
              <Route path='/psychologists' element={<PsychologistsPage />} />
              <Route path='/phones' element={<PhonesPage />} />
              <Route path="/phone/:id" element={<PhoneDetailsPage />} />
              <Route path='/diary' element={<DiariesPage />} />
              <Route path='/diary/create' element={<CreateDiaryPage />} />
              <Route path='/diary/trash' element={<TrashDiaryPage />} />
              <Route path="/diary/:type/edit/:id" element={<EditDiaryPage />} />
              <Route path='/breathing' element={<BreathingPage />} />
              <Route path='/grounding' element={<GroundingPage />} />
              <Route path='/kalimba' element={<KalimbaPage />} />
            </>
          )}

          {role === 'psychologist' && (
            <>
              <Route path='/' element={<div>Страница списка клиентов</div>} />
            </>
          )}

          <Route path='*' element={<Navigate to={role ? "/" : "/login"} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;