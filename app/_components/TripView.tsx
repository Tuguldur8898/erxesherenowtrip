'use client';

import { useState } from 'react';

export function TripView({ trip }: { trip: any }) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'teams' | 'rooms'>('schedule');

  const schedules = trip.schedules || [];
  const teams = trip.teams || [];
  const accommodations = trip.accommodations || [];

  const schedulesByDay: Record<number, any[]> = {};
  for (const s of schedules) {
    if (!schedulesByDay[s.dayNumber]) schedulesByDay[s.dayNumber] = [];
    schedulesByDay[s.dayNumber].push(s);
  }

  const sortedDays = Object.keys(schedulesByDay).map(Number).sort((a, b) => a - b);

  const tabs = [
    { key: 'schedule', label: 'Хуваарь' },
    { key: 'teams', label: 'Багууд' },
    { key: 'rooms', label: 'Унтах хуваарь' },
  ] as const;

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 pb-24 pt-10 text-white sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
            📅 {trip.startDate} — {trip.endDate}
          </div>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{trip.name}</h1>
          <p className="mt-2 text-base text-slate-300">{trip.location}</p>

          {(trip.departureLocation || trip.departureTime) && (
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {trip.departureTime && (
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-slate-100">
                  🕒 {trip.departureTime}
                </span>
              )}
              {trip.departureLocation && (
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-slate-100">
                  📍 {trip.departureLocation}
                </span>
              )}
            </div>
          )}

          {trip.description && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">{trip.description}</p>
          )}
        </div>
      </header>

      <div className="mx-auto -mt-14 max-w-3xl px-4 sm:px-6">
        <div className="sticky top-2 z-10 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-slate-100">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-lg px-2 py-2.5 text-sm font-semibold transition sm:text-base ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6 sm:py-8">
          {activeTab === 'schedule' && sortedDays.length > 0 && (
            <section>
              <div className="space-y-6">
                {sortedDays.map((day) => (
                  <div key={day}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {day}-р өдөр
                    </h3>
                    <div className="relative space-y-4 pl-4 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200">
                      {schedulesByDay[day].map((s: any) => (
                        <div key={s.id} className="relative">
                          <span className="absolute -left-[1.15rem] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-white"></span>
                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <span className="text-sm font-semibold text-indigo-600">
                                {s.startTime}{s.endTime ? ` – ${s.endTime}` : ''}
                              </span>
                              <span className="font-medium text-slate-900">{s.activity}</span>
                            </div>
                            {(s.location || s.notes) && (
                              <div className="mt-2 text-sm text-slate-500">
                                {s.location && <span className="mr-3">📍 {s.location}</span>}
                                {s.notes && <span>{s.notes}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'teams' && teams.length > 0 && (
            <section>
              <div className="grid gap-4 sm:grid-cols-2">
                {teams.map((t: any) => (
                  <div key={t.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">{t.name}</h3>
                      {t.leader && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                          Ахлагч: {t.leader}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {t.members.map((m: any) => (
                        <li key={m.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{m.name}</span>
                          {m.phone && <span className="text-slate-400">{m.phone}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'rooms' && accommodations.length > 0 && (
            <section>
              <div className="grid gap-4 sm:grid-cols-2">
                {accommodations.map((a: any) => (
                  <div key={a.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">🏠</span>
                      <h3 className="font-bold text-slate-900">{a.roomName}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{a.members}</p>
                    {a.notes && <p className="mt-2 text-xs text-slate-400">{a.notes}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
