import React from 'react';
import { Table, Tag, Progress } from 'antd';
import { type Task } from '../types/Tasks';

interface HomeProps {
  tasks: Task[];
  onPatchStatus: (id: string, newStatus: 'ESTABLE' | 'ALTERACIÓN' | 'ESTRÉS') => void;
}

const Home: React.FC<HomeProps> = ({ tasks, onPatchStatus }) => {
  const columns = [
    { 
      title: 'Paciente', 
      dataIndex: ['paciente', 'name'], 
      key: 'name',
      render: (text: string) => <strong style={{ color: 'var(--text-main)' }}>{text}</strong>
    },
    { 
      title: 'Condición', 
      dataIndex: ['paciente', 'condition'], 
      key: 'condition',
      render: (text: string) => <span style={{ color: 'var(--text-muted)' }}>{text}</span>
    },
    { 
      title: 'Estado Wearable', 
      dataIndex: ['paciente', 'status'], 
      key: 'status',
      render: (status: string, record: Task) => {
        let color = 'green';
        if (status === 'ALTERACIÓN') color = 'red';
        if (status === 'ESTRÉS') color = 'orange';
        
        return (
          <Tag 
            color={color} 
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => onPatchStatus(record.id, status === 'ESTABLE' ? 'ESTRÉS' : 'ALTERACIÓN')}
          >
            {status}
          </Tag>
        );
      }
    }
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--text-main)', margin: 15, fontSize: '28px' }}>Bienvenido, Sra. Ramírez</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Monitoreo activo de wearables IncluBand.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ backgroundColor: 'var(--kpi-total)' }}>
          <span className="kpi-num">12</span>
          <span className="kpi-label">Niños Registrados</span>
        </div>
        <div className="kpi-card" style={{ backgroundColor: 'var(--kpi-alertas)' }}>
          <span className="kpi-num" style={{ color: '#ff4d4f' }}>3</span>
          <span className="kpi-label">Alertas Activas</span>
        </div>
        <div className="kpi-card" style={{ backgroundColor: 'var(--kpi-progreso)' }}>
          <span className="kpi-num">8</span>
          <span className="kpi-label">Registros Hoy</span>
        </div>
        <div className="kpi-card" style={{ backgroundColor: 'var(--kpi-estables)' }}>
          <span className="kpi-num">5</span>
          <span className="kpi-label">Estables</span>
        </div>
      </div>

      <div className="home-dashboard-layout">
        <div className="card-incluband">
          <h3 style={{ color: 'var(--text-main)', marginTop: 0 }}>Monitoreo en Tiempo Real</h3>
          <Table dataSource={tasks} columns={columns} rowKey="id" pagination={false} size="middle" />
        </div>

        <div>
          <div className="card-incluband">
            <h3 style={{ color: 'var(--text-main)', marginTop: 0 }}>Historial de Alteraciones</h3>
            <div className="mock-graph">
              <svg viewBox="0 0 400 100" style={{ width: '100%' }}>
                <path d="M10,80 Q70,30 130,55 T250,15 T390,65" fill="none" stroke="#5d5fef" strokeWidth="3" />
                <circle cx="130" cy="55" r="4" fill="#ffcc00" />
                <circle cx="250" cy="15" r="4" fill="#ff3b30" />
              </svg>
            </div>
          </div>

          <div className="card-incluband">
            <h3 style={{ color: 'var(--text-main)', marginTop: 0 }}>Zona de Paz Promedio</h3>
            <Progress percent={82} strokeColor="#34c759" showInfo={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;