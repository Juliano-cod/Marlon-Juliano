import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const activeLinkClass = 'bg-indigo-700 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-indigo-500 hover:text-white';

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-white">Gerenciador de Ideias</span>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink 
              to="/"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Ideias
            </NavLink>
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}