import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaTshirt, FaCog } from 'react-icons/fa';

function Menu() {
  return (
    <nav className="flex justify-around">
      <NavLink to="/" className="flex flex-col items-center">
        <FaUser size={24} className="text-ios-blue" />
        <span className="text-sm">Personnel</span>
      </NavLink>
      <NavLink to="/habillement" className="flex flex-col items-center">
        <FaTshirt size={24} className="text-ios-blue" />
        <span className="text-sm">Habillement</span>
      </NavLink>
      <NavLink to="/parametres" className="flex flex-col items-center">
        <FaCog size={24} className="text-ios-blue" />
        <span className="text-sm">Paramètres</span>
      </NavLink>
    </nav>
  );
}

export default Menu;
