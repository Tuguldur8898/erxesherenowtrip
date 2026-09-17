import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'trips.json');

export type Schedule = {
  id: string;
  tripId: string;
  dayNumber: number;
  startTime: string;
  endTime: string | null;
  activity: string;
  location: string | null;
  notes: string | null;
};

export type TeamMember = {
  id: string;
  teamId: string;
  name: string;
  phone: string | null;
};

export type Team = {
  id: string;
  tripId: string;
  name: string;
  leader: string | null;
  members: TeamMember[];
};

export type Accommodation = {
  id: string;
  tripId: string;
  roomName: string;
  members: string;
  notes: string | null;
};

export type Trip = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  departureLocation: string;
  departureTime: string;
  description: string;
  schedules: Schedule[];
  teams: Team[];
  accommodations: Accommodation[];
};

export function readTrips(): Trip[] {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw) as Trip[];
  } catch (e) {
    console.error('Error reading trips:', e);
    return [];
  }
}

export function getTripById(id: string): Trip | undefined {
  return readTrips().find((t) => t.id === id);
}

export function getLatestTrip(): Trip | undefined {
  const trips = readTrips();
  return trips.length > 0 ? trips[trips.length - 1] : undefined;
}
