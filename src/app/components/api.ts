import type { Patient } from "./patient.types";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_URL}/patients`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("No se pudieron obtener los pacientes.");
  return res.json();
}

export async function getPatient(id: number): Promise<Patient> {
  const res = await fetch(`${API_URL}/patients/${id}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("No se pudo obtener el paciente.");
  return res.json();
}

export async function createPatient(data: {
  name: string;
  birthYear: number;
  code: string;
  doctorId: number;
}): Promise<Patient> {
  const res = await fetch(`${API_URL}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo registrar el paciente.");
  return res.json();
}

export async function updatePatient(id: number, data: Partial<Patient>): Promise<Patient> {
  const res = await fetch(`${API_URL}/patients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el paciente.");
  return res.json();
}

export async function deletePatient(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/patients/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudo eliminar el paciente.");
}

export async function login(
  email: string,
  password: string
): Promise<{ id: number; name: string; email: string; role: "ADMIN" | "DOCTOR"; access_token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    if (res.status >= 500) {
      throw new Error(
        "El servidor no está disponible en este momento. Intenta de nuevo en unos minutos."
      );
    }
    throw new Error("No se pudo iniciar sesión. Intenta de nuevo.");
  }
  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("role", data.role);
  return data;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function isAdmin(): boolean {
  return localStorage.getItem("role") === "ADMIN";
}