'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Trip {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  departureLocation: string;
  departureTime: string;
}

export default function AdminPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [description, setDescription] = useState('');

  const [schedules, setSchedules] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      setTrips(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      location,
      startDate,
      endDate,
      departureLocation,
      departureTime,
      description,
      schedules,
      teams,
      accommodations,
    };

    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      setShowForm(false);
      fetchTrips();
    } else {
      alert('Алдаа гарлаа');
    }
  }

  function resetForm() {
    setName('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDepartureLocation('');
    setDepartureTime('');
    setDescription('');
    setSchedules([]);
    setTeams([]);
    setAccommodations([]);
  }

  async function deleteTrip(id: string) {
    if (!confirm('Устгах уу?')) return;
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    fetchTrips();
  }

  function addSchedule() {
    setSchedules([
      ...schedules,
      { dayNumber: 1, startTime: '', endTime: '', activity: '', location: '', notes: '' },
    ]);
  }

  function updateSchedule(index: number, field: string, value: string) {
    const next = [...schedules];
    next[index][field] = value;
    setSchedules(next);
  }

  function removeSchedule(index: number) {
    setSchedules(schedules.filter((_, i) => i !== index));
  }

  function addTeam() {
    setTeams([...teams, { name: '', leader: '', members: [] }]);
  }

  function updateTeam(index: number, field: string, value: string) {
    const next = [...teams];
    next[index][field] = value;
    setTeams(next);
  }

  function addTeamMember(teamIndex: number) {
    const next = [...teams];
    next[teamIndex].members.push({ name: '', phone: '' });
    setTeams(next);
  }

  function updateTeamMember(teamIndex: number, memberIndex: number, field: string, value: string) {
    const next = [...teams];
    next[teamIndex].members[memberIndex][field] = value;
    setTeams(next);
  }

  function removeTeamMember(teamIndex: number, memberIndex: number) {
    const next = [...teams];
    next[teamIndex].members = next[teamIndex].members.filter((_: any, i: number) => i !== memberIndex);
    setTeams(next);
  }

  function removeTeam(index: number) {
    setTeams(teams.filter((_, i) => i !== index));
  }

  function addAccommodation() {
    setAccommodations([...accommodations, { roomName: '', members: '', notes: '' }]);
  }

  function updateAccommodation(index: number, field: string, value: string) {
    const next = [...accommodations];
    next[index][field] = value;
    setAccommodations(next);
  }

  function removeAccommodation(index: number) {
    setAccommodations(accommodations.filter((_, i) => i !== index));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm text-indigo-600 hover:underline">← Нүүр хуудас</Link>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Админ — Аяллын мэдээлэл</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 sm:px-5 sm:py-2.5"
          >
            {showForm ? 'Буцах' : '+ Шинэ аялал'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 rounded-xl bg-white p-4 shadow sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Аяллын нэр</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                  placeholder="Жишээ: Зуны зугаалга 2026"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Газар</span>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                  placeholder="Жишээ: Тэрэлж"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Эхлэх огноо</span>
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Дуусах огноо</span>
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Хаанаас хөдлөх</span>
                <input
                  value={departureLocation}
                  onChange={(e) => setDepartureLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                  placeholder="Жишээ: Эмнэлгийн урд талбай"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Хэдэн цагт хөдлөх</span>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">Тайлбар</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
                rows={3}
              />
            </label>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Өдөр тутмын хуваарь</h3>
                <button type="button" onClick={addSchedule} className="text-sm text-indigo-600 hover:underline">+ Нэмэх</button>
              </div>
              {schedules.map((s, i) => (
                <div key={i} className="mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-12">
                  <input
                    type="number"
                    min={1}
                    value={s.dayNumber}
                    onChange={(e) => updateSchedule(i, 'dayNumber', e.target.value)}
                    placeholder="Өдөр"
                    className="rounded border px-2 py-2 text-base sm:col-span-1"
                  />
                  <input
                    type="time"
                    value={s.startTime}
                    onChange={(e) => updateSchedule(i, 'startTime', e.target.value)}
                    className="rounded border px-2 py-2 text-base sm:col-span-2"
                  />
                  <input
                    type="time"
                    value={s.endTime}
                    onChange={(e) => updateSchedule(i, 'endTime', e.target.value)}
                    className="rounded border px-2 py-2 text-base sm:col-span-2"
                  />
                  <input
                    value={s.activity}
                    onChange={(e) => updateSchedule(i, 'activity', e.target.value)}
                    placeholder="Үйл ажиллагаа"
                    className="rounded border px-2 py-2 text-base sm:col-span-5"
                  />
                  <button type="button" onClick={() => removeSchedule(i)} className="rounded bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">Устгах</button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Багууд</h3>
                <button type="button" onClick={addTeam} className="text-sm text-indigo-600 hover:underline">+ Баг нэмэх</button>
              </div>
              {teams.map((t, ti) => (
                <div key={ti} className="mb-4 rounded-lg border p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={t.name}
                      onChange={(e) => updateTeam(ti, 'name', e.target.value)}
                      placeholder="Багийн нэр"
                      className="rounded border px-3 py-2"
                    />
                    <input
                      value={t.leader}
                      onChange={(e) => updateTeam(ti, 'leader', e.target.value)}
                      placeholder="Багийн ахлагч"
                      className="rounded border px-3 py-2"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Гишүүд</span>
                      <button type="button" onClick={() => addTeamMember(ti)} className="text-sm text-indigo-600 hover:underline">+ Гишүүн</button>
                    </div>
                    {t.members.map((m: any, mi: number) => (
                      <div key={mi} className="mb-2 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={m.name}
                          onChange={(e) => updateTeamMember(ti, mi, 'name', e.target.value)}
                          placeholder="Нэр"
                          className="flex-1 rounded border px-2 py-2 text-base"
                        />
                        <input
                          value={m.phone}
                          onChange={(e) => updateTeamMember(ti, mi, 'phone', e.target.value)}
                          placeholder="Утас"
                          className="w-full rounded border px-2 py-2 text-base sm:w-40"
                        />
                        <button type="button" onClick={() => removeTeamMember(ti, mi)} className="rounded bg-red-50 px-3 py-2 text-red-600">✕</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => removeTeam(ti)} className="mt-2 text-sm text-red-600">Баг устгах</button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Хонох/унтах хуваарь</h3>
                <button type="button" onClick={addAccommodation} className="text-sm text-indigo-600 hover:underline">+ Нэмэх</button>
              </div>
              {accommodations.map((a, i) => (
                <div key={i} className="mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-3">
                  <input
                    value={a.roomName}
                    onChange={(e) => updateAccommodation(i, 'roomName', e.target.value)}
                    placeholder="Өрөө/байрлал"
                    className="rounded border px-2 py-2 text-base"
                  />
                  <input
                    value={a.members}
                    onChange={(e) => updateAccommodation(i, 'members', e.target.value)}
                    placeholder="Хэн хэнтэй (таслалаар)"
                    className="rounded border px-2 py-2 text-base sm:col-span-2"
                  />
                  <textarea
                    value={a.notes}
                    onChange={(e) => updateAccommodation(i, 'notes', e.target.value)}
                    placeholder="Нэмэлт тайлбар"
                    className="rounded border px-2 py-2 text-base sm:col-span-3"
                    rows={2}
                  />
                  <button type="button" onClick={() => removeAccommodation(i)} className="rounded bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-1">Устгах</button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700">
                Хадгалах
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-6 py-3 text-base">
                Болих
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Ачаалж байна...</p>
        ) : trips.length === 0 ? (
          <p className="text-slate-600">Одоогоор аялал бүртгэгдээгүй байна.</p>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <div key={trip.id} className="rounded-xl bg-white p-5 shadow">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{trip.name}</h2>
                    <p className="text-sm text-slate-600">
                      {trip.location} · {trip.startDate} ~ {trip.endDate}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/trip/${trip.id}`}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Харах
                    </Link>
                    <button
                      onClick={() => {
                        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/trip/${trip.id}`;
                        navigator.clipboard.writeText(url);
                        alert('Линк хуулбарлагдлаа: ' + url);
                      }}
                      className="rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-300"
                    >
                      Линк хуулах
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-200"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
