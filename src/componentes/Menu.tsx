import React from 'react';
import { Switch } from 'antd';
import './Menu.css';


interface MenuProps {
  OnNavigate: (page: 'Inicio' | 'Pacientes' | 'Estadisticas') => void;
  currentPage: string;
  darkMode: boolean;
  onToggleTheme: (checked: boolean) => void;
}


const Menu: React.FC<MenuProps> = ({ OnNavigate, currentPage, darkMode, onToggleTheme }) => {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">IncluBand</div>
        <div className="sidebar-links">
          <button className={`nav-item ${currentPage === 'Inicio' ? 'active' : ''}`} onClick={() => OnNavigate('Inicio')}>
            <span></span> Panel General
          </button>
          <button className={`nav-item ${currentPage === 'Pacientes' ? 'active' : ''}`} onClick={() => OnNavigate('Pacientes')}>
            <span></span> Lista de Pacientes
          </button>
          <button className={`nav-item ${currentPage === 'Estadisticas' ? 'active' : ''}`} onClick={() => OnNavigate('Estadisticas')}>
            <span></span> Gráficas Wearable
          </button>
        </div>
      </div>


      <div className="sidebar-footer">
        <div className="theme-toggle-sec">
          <span>{darkMode ? 'Oscuro' : 'Claro'}</span>
          <Switch checked={darkMode} onChange={onToggleTheme} size="small" />
        </div>
        
        <div className="sidebar-user">
          <div className="avatar">SR</div>
          <div className="user-info">
            <span className="user-name">Sra. Johana</span>
            <span className="user-role">Cuidador</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Menu;

