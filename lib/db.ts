import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'trips.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initDb(db);
  }
  return db;
}

function initDb(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      departureLocation TEXT,
      departureTime TEXT,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      tripId TEXT NOT NULL,
      dayNumber INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT,
      activity TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      tripId TEXT NOT NULL,
      name TEXT NOT NULL,
      leader TEXT,
      FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      teamId TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS accommodations (
      id TEXT PRIMARY KEY,
      tripId TEXT NOT NULL,
      roomName TEXT NOT NULL,
      members TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
    );
  `);
}

export function generateId(): string {
  return uuidv4();
}

export type Trip = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  departureLocation: string;
  departureTime: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

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

export type TripDetail = Trip & {
  schedules: Schedule[];
  teams: Team[];
  accommodations: Accommodation[];
};
