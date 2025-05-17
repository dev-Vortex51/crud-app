import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AddEmployee from './pages/AddEmployee';
import './index.css';
import { useState, useEffect } from 'react';
function App() {
  const [title, setTitle] = useState('');

  useEffect(() => {
    document.title = `CRUD-APP | ${title}`;
  }, [title]);

  return (
    <div>
      <Routes>
        <Route path='/app' element={<Home title={title} setTitle={setTitle} />} />
        <Route index element={<Login title={title} setTitle={setTitle} />} />
        <Route path='/add' element={<AddEmployee title={title} setTitle={setTitle} />} />
      </Routes>
    </div>
  );
}

export default App;
