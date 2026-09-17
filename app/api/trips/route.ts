import { NextRequest, NextResponse } from 'next/server';
import { getDb, generateId } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const trips = db.prepare('SELECT * FROM trips ORDER BY startDate DESC').all();
    return NextResponse.json(trips);
  } catch (error) {
    console.error('GET /api/trips error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
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
    } = body;

    if (!name || !location || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, location, startDate, endDate are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const now = new Date().toISOString();
    const tripId = generateId();

    db.transaction(() => {
      db.prepare(
        `INSERT INTO trips (id, name, location, startDate, endDate, departureLocation, departureTime, description, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        tripId,
        name,
        location,
        startDate,
        endDate,
        departureLocation || '',
        departureTime || '',
        description || '',
        now,
        now
      );

      if (Array.isArray(schedules)) {
        const insertSchedule = db.prepare(
          `INSERT INTO schedules (id, tripId, dayNumber, startTime, endTime, activity, location, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        for (const s of schedules) {
          insertSchedule.run(
            generateId(),
            tripId,
            Number(s.dayNumber) || 1,
            s.startTime || '',
            s.endTime || null,
            s.activity || '',
            s.location || null,
            s.notes || null
          );
        }
      }

      if (Array.isArray(teams)) {
        const insertTeam = db.prepare(
          `INSERT INTO teams (id, tripId, name, leader) VALUES (?, ?, ?, ?)`
        );
        const insertMember = db.prepare(
          `INSERT INTO team_members (id, teamId, name, phone) VALUES (?, ?, ?, ?)`
        );
        for (const t of teams) {
          const teamId = generateId();
          insertTeam.run(teamId, tripId, t.name || '', t.leader || null);
          if (Array.isArray(t.members)) {
            for (const m of t.members) {
              insertMember.run(generateId(), teamId, m.name || '', m.phone || null);
            }
          }
        }
      }

      if (Array.isArray(accommodations)) {
        const insertAcc = db.prepare(
          `INSERT INTO accommodations (id, tripId, roomName, members, notes)
           VALUES (?, ?, ?, ?, ?)`
        );
        for (const a of accommodations) {
          insertAcc.run(
            generateId(),
            tripId,
            a.roomName || '',
            Array.isArray(a.members) ? a.members.join(', ') : a.members || '',
            a.notes || null
          );
        }
      }
    })();

    return NextResponse.json({ id: tripId, message: 'Trip created' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/trips error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
