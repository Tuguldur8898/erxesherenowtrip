import { getLatestTrip } from '@/lib/db';
import { TripView } from './_components/TripView';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const trip = getLatestTrip();

  if (!trip) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Аяллын мэдээлэл</h1>
        <p className="mt-4 text-slate-600">Одоогоор мэдээлэл оруулаагүй байна.</p>
      </main>
    );
  }

  return <TripView trip={trip} />;
}
