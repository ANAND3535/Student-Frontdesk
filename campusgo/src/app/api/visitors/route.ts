import { NextResponse } from 'next/server';
import { executeSoql, createRecord } from '@/lib/salesforce/client';
import type { SalesforceVisitorRecord } from '@/lib/salesforce/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      SELECT Id, Name, Email__c, Contact_Number__c, CreatedDate
      FROM Visitor__c
      ORDER BY CreatedDate DESC
      LIMIT 100
    `;
    const result = await executeSoql<SalesforceVisitorRecord>(query);

    const visitors = result.records.map((rec) => ({
      id: rec.Id,
      name: rec.Name || 'Visitor',
      email: rec.Email__c || 'N/A',
      phone: rec.Contact_Number__c || 'N/A',
      purpose: 'Meeting',
      hostName: 'Campus Reception',
      hostDepartment: 'Administration',
      status: 'Checked In',
      checkInTime: rec.CreatedDate,
      date: rec.CreatedDate,
    }));

    return NextResponse.json({
      success: true,
      total: result.totalSize,
      visitors,
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /visitors GET Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to fetch visitors from Salesforce',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, purpose, hostName, hostDepartment, notes } = body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Map to actual Salesforce Visitor__c fields
    const fieldsToCreate: Record<string, unknown> = {
      Name: name.trim().slice(0, 80),
      Email__c: email.trim().slice(0, 80),
      Contact_Number__c: phone.trim().slice(0, 40),
    };

    // Create record in Salesforce
    const result = await createRecord('Visitor__c', fieldsToCreate);

    return NextResponse.json({
      success: true,
      id: result.id,
      visitor: {
        id: result.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        purpose: purpose || 'Meeting',
        hostName: hostName || 'Administration',
        hostDepartment: hostDepartment || 'Administration',
        status: 'Checked In',
        notes: notes || '',
        checkInTime: new Date().toISOString(),
        date: new Date().toISOString(),
      },
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /visitors POST Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Salesforce visitor registration failed',
      },
      { status: 500 }
    );
  }
}
