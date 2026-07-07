import { Patient } from "./patient.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_URL}/patients`);
  if (!res.ok) throw new Error("No se pudieron obtener los pacientes.");
  return res.json();
}

export async function getPatient(id: number): Promise<Patient> {
  const res = await fetch(`${API_URL}/patients/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener el paciente.");
  return res.json();
}

export async function createPatient(data: {
  name: string;
  birthYear: number;
  code: string;
  doctorId: number; // AJUSTAR: confirmar que CreatePatientDto pide doctorId así
}): Promise<Patient> {
  const res = await fetch(`${API_URL}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo registrar el paciente.");
  return res.json();
}

export async function updatePatient(id: number, data: Partial<Patient>): Promise<Patient> {
  const res = await fetch(`${API_URL}/patients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el paciente.");
  return res.json();
}

export async function deletePatient(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/patients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar el paciente.");
}

// AJUSTAR: esto asume que existe un endpoint /auth/login para Doctor.
// Si tu backend no lo tiene todavía, avisame y lo armamos juntos.
export async function login(email: string, password: string): Promise<{ id: number; name: string; email: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas.");
  return res.json();
}