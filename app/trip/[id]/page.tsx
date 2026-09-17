import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as any;

  if (!trip) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold">Аялал олдсонгүй</h1>
        <Link href="/" className="mt-4 text-indigo-600 hover:underline">Нүүр хуудас руу буцах</Link>
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

  const schedulesByDay: Record<number, any[]> = {};
  for (const s of schedules) {
    if (!schedulesByDay[s.dayNumber]) schedulesByDay[s.dayNumber] = [];
    schedulesByDay[s.dayNumber].push(s);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">← Нүүр хуудас</Link>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-700 to-violet-700 p-4 text-white shadow-lg sm:p-6">
          <h1 className="text-xl font-bold sm:text-2xl">{trip.name}</h1>
          <p className="mt-1 text-sm text-indigo-100 sm:text-base">{trip.location}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-4">
            <span>📅 {trip.startDate} ~ {trip.endDate}</span>
            {trip.departureLocation && <span>🚌 {trip.departureLocation}</span>}
            {trip.departureTime && <span>🕒 {trip.departureTime}</span>}
          </div>
          {trip.description && <p className="mt-4 text-sm text-indigo-100">{trip.description}</p>}
        </div>

        {Object.keys(schedulesByDay).length > 0 && (
          <section className="mt-4 rounded-xl bg-white p-4 shadow sm:mt-6 sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Өдөр тутмын хуваарь</h2>
            {Object.entries(schedulesByDay).map(([day, items]) => (
              <div key={day} className="mb-4">
                <h3 className="mb-2 font-semibold text-indigo-700">{day}-р өдөр</h3>
                <div className="space-y-2">
                  {items.map((s: any) => (
                    <div key={s.id} className="rounded-lg border-l-4 border-indigo-500 bg-slate-50 p-3">
                      <div className="flex flex-col gap-1 text-sm font-semibold text-slate-800 sm:flex-row sm:items-center sm:gap-2">
                        <span className="whitespace-nowrap text-indigo-700">{s.startTime}{s.endTime ? ` - ${s.endTime}` : ''}</span>
                        <span className="text-slate-600">{s.activity}</span>
                      </div>
                      {s.location && <p className="mt-1 text-sm text-slate-600">📍 {s.location}</p>}
                      {s.notes && <p className="mt-1 text-sm text-slate-500">{s.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {teams.length > 0 && (
          <section className="mt-4 rounded-xl bg-white p-4 shadow sm:mt-6 sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Багууд</h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {teams.map((t: any) => (
                <div key={t.id} className="rounded-lg border p-4">
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  {t.leader && <p className="text-sm text-indigo-600">Ахлагч: {t.leader}</p>}
                  <ul className="mt-2 space-y-1">
                    {t.members.map((m: any) => (
                      <li key={m.id} className="text-sm text-slate-700">
                        {m.name} {m.phone && <span className="text-slate-500">({m.phone})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {accommodations.length > 0 && (
          <section className="mt-4 rounded-xl bg-white p-4 shadow sm:mt-6 sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Хонох/унтах хуваарь</h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {accommodations.map((a: any) => (
                <div key={a.id} className="rounded-lg border p-4">
                  <h3 className="font-bold text-slate-900">{a.roomName}</h3>
                  <p className="mt-1 text-sm text-slate-700">👥 {a.members}</p>
                  {a.notes && <p className="mt-1 text-sm text-slate-500">{a.notes}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
