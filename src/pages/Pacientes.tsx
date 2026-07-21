import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Popconfirm, Modal, Form, Select } from 'antd';
import { type Task } from '../types/Tasks';

interface PacientesProps {
  tasks: Task[];
  onPostPaciente: (name: string, age: number, status: 'ESTABLE' | 'ALTERACIÓN' | 'ESTRÉS') => void;
  onDeletePaciente: (id: string) => void;
}

const Pacientes: React.FC<PacientesProps> = ({ tasks, onPostPaciente, onDeletePaciente }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Niño / Paciente', dataIndex: ['paciente', 'name'], key: 'name', render: (t: string) => <strong>{t}</strong> },
    { title: 'Edad', dataIndex: ['paciente', 'age'], key: 'age', render: (age: number) => `${age} años` },
    { title: 'Diagnóstico', dataIndex: ['paciente', 'condition'], key: 'condition' },
    {
      title: 'Estado',
      dataIndex: ['paciente', 'status'],
      key: 'status',
      render: (status: string) => {
        let col = status === 'ESTABLE' ? 'green' : status === 'ESTRÉS' ? 'orange' : 'red';
        return <Tag color={col} style={{ fontWeight: 'bold' }}>{status}</Tag>;
      }
    },
    { title: 'Postman Trigger', dataIndex: 'tipo', key: 'tipo', render: (tipo: string) => <Tag color="purple">{tipo}</Tag> },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Task) => (
        <Popconfirm title="¿Eliminar este registro?" onConfirm={() => onDeletePaciente(record.id)}>
          <Button type="link" danger size="small">Eliminar [DELETE]</Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', margin: 0 }}>Lista de Pacientes Vinculados</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Simulación de Niños/Pacientes</p>
        </div>
        <Button type="primary" onClick={() => setIsOpen(true)} style={{ backgroundColor: 'var(--bg-sidebar)' }}>
          + Vincular Niño [POST]
        </Button>
      </div>

      <div className="card-incluband" style={{ padding: 0, overflow: 'hidden' }}>
        <Table 
          dataSource={tasks} 
          columns={columns} 
          rowKey="id"
          rowClassName={(record) => {
            if (record.paciente.status === 'ALTERACIÓN') return 'row-alert-critica';
            if (record.paciente.status === 'ESTRÉS') return 'row-alert-estres';
            return '';
          }}
        />
      </div>

      <Modal title="Vincular Dispositivo Wearable" open={isOpen} onCancel={() => setIsOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={(v) => { onPostPaciente(v.name, v.age, v.status); setIsOpen(false); form.resetFields(); }}>
          <Form.Item name="name" label="Nombre del Niño" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Edad" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Estado Wearable" initialValue="ESTABLE">
            <Select>
              <Select.Option value="ESTABLE">Estable</Select.Option>
              <Select.Option value="ESTRÉS">Estrés</Select.Option>
              <Select.Option value="ALTERACIÓN">Alteración</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pacientes;