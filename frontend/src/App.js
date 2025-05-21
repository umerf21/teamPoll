import './App.css';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import Results from './pages/Pollresults';

function App() {
  return (
    <div className="App">
       <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/results" element={<Results />} />
    </Routes>
    </div>
  );
}

export default App;
