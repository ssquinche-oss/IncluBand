export interface Paciente {
  id: string;
  name: string;
  age: number;
  condition: string; 
  status: 'ESTABLE' | 'ALTERACIÓN' | 'ESTRÉS'; 
}

export interface RegistroDiario {
  id: string;
  pacienteId: string;
  fecha: string; 
  nivelEstres: number; 
  alertasEmitidas: number;
}

export interface RegistroMensual {
  id: string;
  pacienteId: string;
  mes: string; 
  porcentajePaz: number; 
  totalAlertas: number;
}

export interface Task {
  id: string;
  tipo: 'GET' | 'POST' | 'PATCH' | 'DELETE'; 
  paciente: Paciente;
  registros7Dias: RegistroDiario[];
  historicoMensual: RegistroMensual[];
}