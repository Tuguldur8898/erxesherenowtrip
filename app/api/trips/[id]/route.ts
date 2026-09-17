import { NextRequest, NextResponse } from 'next/server';
import { getDb, generateId } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const schedules = db.prepare('SELECT * FROM schedules WHERE tripId = ? ORDER BY dayNumber, startTime').all(id);
    const teamsRaw = db.prepare('SELECT * FROM teams WHERE tripId = ?').all(id);
    const accommodations = db.prepare('SELECT * FROM accommodations WHERE tripId = ?').all(id);

    const teams = [];
    for (const t of teamsRaw as any[]) {
      const members = db
        .prepare('SELECT * FROM team_members WHERE teamId = ?')
        .all(t.id);
      teams.push({ ...t, members });
    }

    return NextResponse.json({ ...trip, schedules, teams, accommodations });
  } catch (error) {
    console.error('GET /api/trips/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const db = getDb();
    const existing = db.prepare('SELECT id FROM trips WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    db.transaction(() => {
      db.prepare(
        `UPDATE trips SET name = ?, location = ?, startDate = ?, endDate = ?, departureLocation = ?, departureTime = ?, description = ?, updatedAt = ? WHERE id = ?`
      ).run(
        name,
        location,
        startDate,
        endDate,
        departureLocation || '',
        departureTime || '',
        description || '',
        now,
        id
      );

      db.prepare('DELETE FROM schedules WHERE tripId = ?').run(id);
      db.prepare('DELETE FROM team_members WHERE teamId IN (SELECT id FROM teams WHERE tripId = ?)').run(id);
      db.prepare('DELETE FROM teams WHERE tripId = ?').run(id);
      db.prepare('DELETE FROM accommodations WHERE tripId = ?').run(id);

      if (Array.isArray(schedules)) {
        const insertSchedule = db.prepare(
          `INSERT INTO schedules (id, tripId, dayNumber, startTime, endTime, activity, location, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        for (const s of schedules) {
          insertSchedule.run(
            generateId(),
            id,
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
          insertTeam.run(teamId, id, t.name || '', t.leader || null);
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
            id,
            a.roomName || '',
            Array.isArray(a.members) ? a.members.join(', ') : a.members || '',
            a.notes || null
          );
        }
      }
    })();

    return NextResponse.json({ message: 'Trip updated' });
  } catch (error) {
    console.error('PUT /api/trips/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM trips WHERE id = ?').run(id);
    return NextResponse.json({ message: 'Trip deleted' });
  } catch (error) {
    console.error('DELETE /api/trips/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
