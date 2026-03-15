import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Button from './components/common/Button/Button';

function App() {
  return (
    <BrowserRouter>
      <Button>
        <div>123</div>
        <div>456</div>
      </Button>
    </BrowserRouter>
  );
}

export default App;
