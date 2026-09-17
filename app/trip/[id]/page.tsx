import { getDb } from '@/lib/db';
import { TripView } from '../../_components/TripView';

export const dynamic = 'force-dynamic';

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as any;

  if (!trip) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Аялал олдсонгүй</h1>
        <p className="mt-4 text-slate-600">Линк буруу байж магадгүй.</p>
      </main>
    );
  }

  const schedules = db.prepare('SELECT * FROM schedules WHERE tripId = ? ORDER BY dayNumber, startTime').all(id) as any[];
  const teamsRaw = db.prepare('SELECT * FROM teams WHERE tripId = ?').all(id) as any[];
  const accommodations = db.prepare('SELECT * FROM accommodations WHERE tripId = ?').all(id) as any[];

  const teams = [];
  for (const t of teamsRaw) {
    const members = db.prepare('SELECT * FROM team_members WHERE teamId = ?').all(t.id) as any[];
    teams.push({ ...t, members });
  }

  return <TripView trip={{ ...trip, schedules, teams, accommodations }} />;
}
