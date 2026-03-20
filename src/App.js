import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/profile' element={<ProfilePage />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
