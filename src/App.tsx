import { useState } from 'react';
import Menu from './componentes/menu';
import Home from './pages/Home';
import Pacientes from './pages/Pacientes';
import Estadisticas from './pages/Estadisticas';
import { type Task } from './types/Tasks';
import './index.css';

function App() {
  const [page, setPage] = useState<'Inicio' | 'Pacientes' | 'Estadisticas'>('Inicio');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      tipo: 'GET',
      paciente: { id: 'p1', name: 'Laura Martínez G.', age: 8, condition: 'Síndrome de Down', status: 'ALTERACIÓN' },
      registros7Dias: [
        { id: 'r1', pacienteId: 'p1', fecha: 'Lun', nivelEstres: 80, alertasEmitidas: 2 },
        { id: 'r2', pacienteId: 'p1', fecha: 'Mar', nivelEstres: 75, alertasEmitidas: 1 },
        { id: 'r3', pacienteId: 'p1', fecha: 'Mié', nivelEstres: 85, alertasEmitidas: 3 },
        { id: 'r4', pacienteId: 'p1', fecha: 'Jue', nivelEstres: 40, alertasEmitidas: 0 },
        { id: 'r5', pacienteId: 'p1', fecha: 'Vie', nivelEstres: 20, alertasEmitidas: 0 },
        { id: 'r6', pacienteId: 'p1', fecha: 'Sáb', nivelEstres: 65, alertasEmitidas: 1 },
        { id: 'r7', pacienteId: 'p1', fecha: 'Dom', nivelEstres: 50, alertasEmitidas: 1 },
      ],
      historicoMensual: [
        { id: 'm1', pacienteId: 'p1', mes: 'Mayo', porcentajePaz: 78, totalAlertas: 14 },
        { id: 'm2', pacienteId: 'p1', mes: 'Abril', porcentajePaz: 92, totalAlertas: 5 }
      ]
    },
    {
      id: '2',
      tipo: 'GET',
      paciente: { id: 'p2', name: 'Jaime Flores L.', age: 6, condition: 'Síndrome de Down', status: 'ESTRÉS' },
      registros7Dias: [],
      historicoMensual: [{ id: 'm3', pacienteId: 'p2', mes: 'Mayo', porcentajePaz: 60, totalAlertas: 22 }]
    }
  ]);

  const handleToggleTheme = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handlePostPaciente = (name: string, age: number, status: 'ESTABLE' | 'ALTERACIÓN' | 'ESTRÉS') => {
    const newTask: Task = {
      id: String(Date.now()),
      tipo: 'POST',
      paciente: { id: String(Date.now() + 1), name, age: Number(age), condition: 'Síndrome de Down', status },
      registros7Dias: [{ id: 'rx', pacienteId: 'px', fecha: 'Hoy', nivelEstres: 30, alertasEmitidas: 0 }],
      historicoMensual: [{ id: 'mx', pacienteId: 'px', mes: 'Junio', porcentajePaz: 100, totalAlertas: 0 }]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handlePatchStatus = (id: string, newStatus: 'ESTABLE' | 'ALTERACIÓN' | 'ESTRÉS') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, tipo: 'PATCH', paciente: { ...t.paciente, status: newStatus } } : t));
  };

  const handleDeletePaciente = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="app-container">
      <Menu OnNavigate={setPage} currentPage={page} darkMode={darkMode} onToggleTheme={handleToggleTheme} />
      <div className="main-content">
        {page === 'Pacientes' && <Pacientes tasks={tasks} onPostPaciente={handlePostPaciente} onDeletePaciente={handleDeletePaciente} />}
        {page === 'Estadisticas' && <Estadisticas tasks={tasks} />}
        {page === 'Inicio' && <Home tasks={tasks} onPatchStatus={handlePatchStatus} />}
      </div>
    </div>
  );
}

export default App;
