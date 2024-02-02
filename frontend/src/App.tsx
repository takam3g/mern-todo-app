import { Routes, Route } from 'react-router-dom';

import './App.scss';
import Auth from './routes/Auth';
import ToDo from './routes/ToDo';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Auth />} />
      <Route path='todo' element={<ToDo />} />
    </Routes>
  );
}

export default App;
