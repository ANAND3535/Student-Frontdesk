import { NextResponse } from 'next/server';
import { executeSoql, createRecord } from '@/lib/salesforce/client';
import type { SalesforceAppointmentRecord } from '@/lib/salesforce/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      SELECT Id, Name, CreatedDate
      FROM Appointment__c
      ORDER BY CreatedDate DESC
      LIMIT 100
    `;
    const result = await executeSoql<SalesforceAppointmentRecord>(query);

    const appointments = result.records.map((rec) => ({
      id: rec.Id,
      studentName: 'Student Candidate',
      studentId: `STU-${rec.Id.slice(-6).toUpperCase()}`,
      email: 'student@campus.edu',
      phone: '+91 90000 00000',
      type: 'Counseling',
      staffName: rec.Name || 'Counselor',
      department: 'Academic Affairs',
      date: rec.CreatedDate.slice(0, 10),
      time: '10:00 AM',
      duration: 30,
      status: 'Scheduled',
      createdAt: rec.CreatedDate,
    }));

    return NextResponse.json({
      success: true,
      total: result.totalSize,
      appointments,
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /appointments GET Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, staffName, type } = body;

    const name = (staffName || studentName || type || 'Appointment').slice(0, 80);
    const result = await createRecord('Appointment__c', { Name: name });

    return NextResponse.json({
      success: true,
      id: result.id,
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /appointments POST Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
