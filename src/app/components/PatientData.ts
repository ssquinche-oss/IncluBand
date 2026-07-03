export interface Patient {
  id: string;
  name: string;
  age: number;
  birthDate: string;
  deviceId: string;
  status: "stable" | "alert" | "critical";
  lastSync: string;
  pulse: number;
  spo2: number;
  temperature: number;
  steps: number;
  emotionalState: "tranquilo" | "activo" | "agitado";
  pulseHistory: { time: string; value: number }[];
  stabilityHistory: { time: string; value: number }[];
  movementHistory: { time: string; value: number }[];
  episodes: { date: string; type: string; duration: string; intensity: string }[];
}

function generatePulseHistory(base: number) {
  const hours = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date();
    d.setHours(d.getHours() - i);
    const hour = d.getHours().toString().padStart(2, "0") + ":00";
    const noise = Math.floor(Math.random() * 20) - 10;
    hours.push({ time: hour, value: Math.max(60, Math.min(160, base + noise)) });
  }
  return hours;
}

function generateStabilityHistory(base: number) {
  const points = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date();
    d.setHours(d.getHours() - i);
    const hour = d.getHours().toString().padStart(2, "0") + ":00";
    const noise = Math.floor(Math.random() * 30) - 15;
    points.push({ time: hour, value: Math.max(10, Math.min(100, base + noise)) });
  }
  return points;
}

function generateMovementHistory(base: number) {
  const points = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setHours(d.getHours() - i * 2);
    const hour = d.getHours().toString().padStart(2, "0") + ":00";
    const noise = Math.floor(Math.random() * 40) - 20;
    points.push({ time: hour, value: Math.max(0, Math.min(100, base + noise)) });
  }
  return points;
}

export const PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Mateo González",
    age: 8,
    birthDate: "2016-03-15",
    deviceId: "NP-001",
    status: "stable",
    lastSync: "Hace 2 min",
    pulse: 118,
    spo2: 98,
    temperature: 36.5,
    steps: 4230,
    emotionalState: "tranquilo",
    pulseHistory: generatePulseHistory(118),
    stabilityHistory: generateStabilityHistory(75),
    movementHistory: generateMovementHistory(60),
    episodes: [
      { date: "Lun. 5 May", type: "Actividad alta", duration: "15 min", intensity: "Alta" },
      { date: "Mar. 6 May", type: "Agitación nocturna", duration: "8 min", intensity: "Media" },
      { date: "Mié. 7 May", type: "Crisis leve", duration: "3 min", intensity: "Baja" },
    ],
  },
  {
    id: "2",
    name: "Lucía Morales",
    age: 6,
    birthDate: "2018-07-22",
    deviceId: "NP-002",
    status: "stable",
    lastSync: "Hace 5 min",
    pulse: 85,
    spo2: 99,
    temperature: 36.2,
    steps: 2100,
    emotionalState: "tranquilo",
    pulseHistory: generatePulseHistory(85),
    stabilityHistory: generateStabilityHistory(85),
    movementHistory: generateMovementHistory(40),
    episodes: [
      { date: "Lun. 5 May", type: "Actividad normal", duration: "20 min", intensity: "Baja" },
    ],
  },
  {
    id: "3",
    name: "Andrés Peña",
    age: 10,
    birthDate: "2014-11-08",
    deviceId: "NP-003",
    status: "alert",
    lastSync: "Hace 1 min",
    pulse: 101,
    spo2: 96,
    temperature: 37.1,
    steps: 5890,
    emotionalState: "activo",
    pulseHistory: generatePulseHistory(101),
    stabilityHistory: generateStabilityHistory(55),
    movementHistory: generateMovementHistory(70),
    episodes: [
      { date: "Lun. 5 May", type: "Estrés físico", duration: "12 min", intensity: "Media" },
      { date: "Mar. 6 May", type: "Agitación diurna", duration: "6 min", intensity: "Media" },
    ],
  },
  {
    id: "4",
    name: "Sofía Ruiz",
    age: 5,
    birthDate: "2019-04-01",
    deviceId: "NP-004",
    status: "stable",
    lastSync: "Hace 3 min",
    pulse: 82,
    spo2: 99,
    temperature: 36.4,
    steps: 980,
    emotionalState: "tranquilo",
    pulseHistory: generatePulseHistory(82),
    stabilityHistory: generateStabilityHistory(90),
    movementHistory: generateMovementHistory(25),
    episodes: [],
  },
  {
    id: "5",
    name: "Carlos Vera",
    age: 12,
    birthDate: "2012-09-17",
    deviceId: "NP-005",
    status: "critical",
    lastSync: "Hace 8 min",
    pulse: 142,
    spo2: 94,
    temperature: 37.8,
    steps: 7210,
    emotionalState: "agitado",
    pulseHistory: generatePulseHistory(142),
    stabilityHistory: generateStabilityHistory(30),
    movementHistory: generateMovementHistory(85),
    episodes: [
      { date: "Lun. 5 May", type: "Crisis severa", duration: "18 min", intensity: "Alta" },
      { date: "Mar. 6 May", type: "Agitación extrema", duration: "22 min", intensity: "Alta" },
      { date: "Jue. 8 May", type: "Crisis nocturna", duration: "10 min", intensity: "Alta" },
    ],
  },
  {
    id: "6",
    name: "Valentina Mora",
    age: 7,
    birthDate: "2017-01-30",
    deviceId: "NP-006",
    status: "stable",
    lastSync: "Hace 4 min",
    pulse: 91,
    spo2: 98,
    temperature: 36.7,
    steps: 3450,
    emotionalState: "activo",
    pulseHistory: generatePulseHistory(91),
    stabilityHistory: generateStabilityHistory(70),
    movementHistory: generateMovementHistory(55),
    episodes: [
      { date: "Mié. 7 May", type: "Actividad intensa", duration: "9 min", intensity: "Media" },
    ],
  },
  {
    id: "7",
    name: "Nicolás Flores",
    age: 11,
    birthDate: "2013-06-12",
    deviceId: "NP-007",
    status: "stable",
    lastSync: "Hace 6 min",
    pulse: 77,
    spo2: 98,
    temperature: 36.3,
    steps: 6100,
    emotionalState: "tranquilo",
    pulseHistory: generatePulseHistory(77),
    stabilityHistory: generateStabilityHistory(80),
    movementHistory: generateMovementHistory(65),
    episodes: [],
  },
  {
    id: "8",
    name: "Isabella García",
    age: 9,
    birthDate: "2015-12-03",
    deviceId: "NP-008",
    status: "alert",
    lastSync: "Hace 2 min",
    pulse: 109,
    spo2: 97,
    temperature: 37.3,
    steps: 4780,
    emotionalState: "agitado",
    pulseHistory: generatePulseHistory(109),
    stabilityHistory: generateStabilityHistory(45),
    movementHistory: generateMovementHistory(75),
    episodes: [
      { date: "Mar. 6 May", type: "Episodio de ansiedad", duration: "7 min", intensity: "Media" },
      { date: "Jue. 8 May", type: "Agitación diurna", duration: "11 min", intensity: "Media" },
    ],
  },
];
