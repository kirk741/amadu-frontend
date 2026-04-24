import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import EmotionLogsPage from './pages/EmotionLogsPage/EmotionLogsPage';
import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import DiariesPage from './pages/DiariesPage/DiariesPage';
import CreateDiaryPage from './pages/CreateDiaryPage/CreateDiaryPage';
import TrashDiaryPage from './pages/TrashDiaryPage/TrashDiaryPage';
import BreathingPage from './pages/BreathingPage/BreathingPage';
import GroundingPage from './pages/GroundingPage/GroundingPage';
import KalimbaPage from './pages/KalimbaPage/KalimbaPage';
import { useEffect } from 'react';
import EditDiaryPage from './pages/EditDiaryPage/EditDiaryPage';
import PhonesPage from './pages/PhonesPage/PhonesPage';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = savedTheme;
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/profile' element={<ProfilePage />}></Route>
          <Route path='/emotion-logs' element={<EmotionLogsPage />}></Route>
          <Route path='/psychologists' element={<PsychologistsPage />}></Route>
          <Route path='/user/:id' element={<UserProfilePage />}></Route>
          <Route path='/diary' element={<DiariesPage />}></Route>
          <Route path='/diary/create' element={<CreateDiaryPage />}></Route>
          <Route path='/diary/edit' element={<CreateDiaryPage />}></Route>
          <Route path='/diary/trash' element={<TrashDiaryPage />}></Route>
          <Route path='/breathing' element={<BreathingPage />}></Route>
          <Route path='/grounding' element={<GroundingPage />}></Route>
          <Route path='/kalimba' element={<KalimbaPage />}></Route>
          <Route path='/phones' element={<PhonesPage />}></Route>
          <Route path="/diary/:type/edit/:id" element={<EditDiaryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
