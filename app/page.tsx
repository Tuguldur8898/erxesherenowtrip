import { getDb } from '@/lib/db';
import { TripView } from './_components/TripView';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = getDb();
  const trip = db.prepare('SELECT * FROM trips ORDER BY startDate DESC LIMIT 1').get() as any;

  if (!trip) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Аяллын мэдээлэл</h1>
        <p className="mt-4 text-slate-600">Одоогоор мэдээлэл оруулаагүй байна.</p>
        <p className="mt-2 text-sm text-slate-500">Админ: /admin</p>
      </main>
    );
  }

  const schedules = db.prepare('SELECT * FROM schedules WHERE tripId = ? ORDER BY dayNumber, startTime').all(trip.id) as any[];
  const teamsRaw = db.prepare('SELECT * FROM teams WHERE tripId = ?').all(trip.id) as any[];
  const accommodations = db.prepare('SELECT * FROM accommodations WHERE tripId = ?').all(trip.id) as any[];

  const teams = [];
  for (const t of teamsRaw) {
    const members = db.prepare('SELECT * FROM team_members WHERE teamId = ?').all(t.id) as any[];
    teams.push({ ...t, members });
  }

  return <TripView trip={{ ...trip, schedules, teams, accommodations }} />;
}
