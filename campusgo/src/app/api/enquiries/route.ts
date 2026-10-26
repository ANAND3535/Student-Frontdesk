import { NextResponse } from 'next/server';
import { executeSoql, createRecord } from '@/lib/salesforce/client';
import type { SalesforceEnquiryRecord } from '@/lib/salesforce/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      SELECT Id, Name, CreatedDate
      FROM Student_Enquiry__c
      ORDER BY CreatedDate DESC
      LIMIT 100
    `;
    const result = await executeSoql<SalesforceEnquiryRecord>(query);

    const enquiries = result.records.map((rec) => ({
      id: rec.Id,
      studentName: rec.Name || 'Student',
      studentId: `STU-${rec.Id.slice(-6).toUpperCase()}`,
      email: 'student@campus.edu',
      phone: '+91 90000 00000',
      subject: rec.Name || 'Student Enquiry',
      description: 'Submitted via Campus Front Desk Portal',
      category: 'General',
      priority: 'Medium',
      status: 'Open',
      createdAt: rec.CreatedDate,
      updatedAt: rec.CreatedDate,
    }));

    return NextResponse.json({
      success: true,
      total: result.totalSize,
      enquiries,
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /enquiries GET Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, subject } = body;

    if (!studentName && !subject) {
      return NextResponse.json({ success: false, error: 'Student name or subject is required' }, { status: 400 });
    }

    const name = (subject || studentName || 'New Enquiry').slice(0, 80);
    const result = await createRecord('Student_Enquiry__c', { Name: name });

    return NextResponse.json({
      success: true,
      id: result.id,
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /enquiries POST Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
