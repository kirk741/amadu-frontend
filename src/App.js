import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
