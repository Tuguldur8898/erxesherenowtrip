import { getTripById } from '@/lib/db';
import { TripView } from '../../_components/TripView';

export const dynamic = 'force-dynamic';

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = getTripById(id);

  if (!trip) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Аялал олдсонгүй</h1>
        <p className="mt-4 text-slate-600">Линк буруу байж магадгүй.</p>
      </main>
    );
  }

  return <TripView trip={trip} />;
}
