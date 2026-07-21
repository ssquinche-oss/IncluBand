import React from 'react';
import { Progress, Tag, Table } from 'antd';
import { type Task } from '../types/Tasks';

interface EstadisticasProps {
  tasks: Task[];
}

const Estadisticas: React.FC<EstadisticasProps> = ({ tasks }) => {
  const currentTask = tasks[0]; // Primer niño muestra el detalle analítico

  const monthlyColumns = [
    { title: 'Mes Evaluado', dataIndex: 'mes', key: 'mes' },
    { 
      title: '% de Paz del mes', 
      dataIndex: 'porcentajePaz', 
      key: 'porcentajePaz',
      render: (pct: number) => <Progress percent={pct} size="small" strokeColor="#34c759" />
    },
    { 
      title: 'Alertas Totales', 
      dataIndex: 'totalAlertas', 
      key: 'totalAlertas',
      render: (num: number) => <Tag color="red">{num} Alertas</Tag>
    }
  ];

  return (
    <div className="profile-layout fade-in">
      <div className="profile-sidebar-card">
        <div className="profile-avatar-circle"></div>
        <h2 style={{ color: 'var(--text-main)', margin: '0 0 8px 0' }}>{currentTask.paciente.name}</h2>
        <Tag color="red" style={{ fontWeight: 'bold', marginBottom: '16px' }}>{currentTask.paciente.status}</Tag>
        
        <div className="profile-mini-kpis">
          <div className="pkpi"><strong style={{ color: 'var(--text-main)' }}>7 Días</strong><p>Muestra</p></div>
          <div className="pkpi"><strong style={{ color: '#ff4d4f' }}>{currentTask.historicoMensual[0].totalAlertas}</strong><p>Alertas</p></div>
          <div className="pkpi"><strong style={{ color: '#34c759' }}>{currentTask.historicoMensual[0].porcentajePaz}%</strong><p>Paz</p></div>
        </div>
      </div>

      <div>
        <div className="card-incluband">
          <h3 style={{ color: 'var(--text-main)', marginTop: 0 }}>Nivel de Estrés Wearable — Últimos 7 Días</h3>
          <div className="mock-graph-big">
            <svg viewBox="0 0 500 120" style={{ width: '100%' }}>
              <path d="M10,90 L80,75 L160,85 L240,40 L320,15 L400,65 L490,50" fill="none" stroke="#5d5fef" strokeWidth="3" />
            </svg>
            <div className="graph-labels">
              {currentTask.registros7Dias.map(r => <span key={r.id}>{r.fecha}</span>)}
            </div>
          </div>
        </div>

        <div className="card-incluband">
          <h3 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '16px' }}>Histórico de Porcentajes por Mes</h3>
          <Table dataSource={currentTask.historicoMensual} columns={monthlyColumns} rowKey="id" pagination={false} size="small" />
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;