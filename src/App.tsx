import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import NavBar from './components/NavBar';
import { Idea } from './types';

export default function App() {
    const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas');
        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />
      <main className="pt-10">
        <Routes>
          <Route path="/" element={<HomePage ideas={ideas} setIdeas={setIdeas} />} />
          <Route path="/dashboard" element={<DashboardPage ideas={ideas} />} />
        </Routes>
      </main>
    </div>
  );
}
