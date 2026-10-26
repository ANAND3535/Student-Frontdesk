import { NextResponse } from 'next/server';
import { executeSoql } from '@/lib/salesforce/client';
import type { SalesforceFaqRecord } from '@/lib/salesforce/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      SELECT Id, Name, Question__c, Answer__c, Category__c, Is_Published__c, Display_Order__c
      FROM FAQ__c
      WHERE Is_Published__c = true
      ORDER BY Display_Order__c ASC NULLS LAST, CreatedDate DESC
      LIMIT 100
    `;
    const result = await executeSoql<SalesforceFaqRecord>(query);

    const faqs = result.records.map((rec) => ({
      id: rec.Id,
      question: rec.Question__c,
      answer: rec.Answer__c || '<p>No details provided.</p>',
      category: rec.Category__c || 'General',
      displayOrder: rec.Display_Order__c || 0,
    }));

    return NextResponse.json({
      success: true,
      total: result.totalSize,
      data: faqs,
      source: 'salesforce',
    });
  } catch (error) {
    console.error('[API /faq GET Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
