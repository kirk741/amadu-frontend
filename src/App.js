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
import { useAuthContext } from './context/AuthContext';
import BookingPage from './pages/ClientPages/BookingPage/BookingPage';
import AppointmentPage from './pages/ClientPages/AppointmentPages/AppointmentPage';
import AppointmentsPage from './pages/ClientPages/AppointmentPages/AppointmentsPage/AppointmentsPage';
import EventsPage from './pages/ClientPages/EventsPage/EventsPage';

import PsyHomePage from './pages/PsychologistPages/HomePage/HomePage';
import PsyAppointmentsPage from './pages/PsychologistPages/AppointmentsPage/AppointmentsPage';
import { ScheduleProvider } from './context/ScheduleContext';
import PsyEventsPage from './pages/PsychologistPages/EventsPage/EventsPage';
import LibraryPage from './pages/PsychologistPages/LibraryPage/LibraryPage';

import ChatsPage from './pages/ChatPages/ChatsPage/ChatsPage';
import ChatPage from './pages/ChatPages/ChatPage/ChatPage';

function App() {
  const { role } = useAuthContext();

  return (
    <BrowserRouter>
      <ScheduleProvider>
        <Layout>
          <Routes>
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/user/:id' element={<UserProfilePage />} />

            <Route path='/chats' element={<ChatsPage />} />
            <Route path='/chat/:id' element={<ChatPage />} />

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
                <Route path='/booking/:id' element={<BookingPage />} />
                <Route path='/appointments' element={<AppointmentsPage />} />
                <Route path='/appointment/:id' element={<AppointmentPage />} />
                <Route path='/events' element={<EventsPage />} />
              </>
            )}

            {role === 'psychologist' && (
              <>
                <Route path='/' element={<PsyHomePage />} />
                <Route path="/applications" element={<PsyAppointmentsPage />} />
                <Route path="/events" element={<PsyEventsPage />} />
                <Route path="/library" element={<LibraryPage />} />
              </>
            )}

            <Route path='*' element={<Navigate to={role ? "/" : "/login"} />} />
          </Routes>
        </Layout>
      </ScheduleProvider>
    </BrowserRouter>
  );
}

export default App;
