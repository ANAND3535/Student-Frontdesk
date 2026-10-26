/**
 * Salesforce Integration Types
 */

export interface SalesforceAuthResult {
  accessToken: string;
  instanceUrl: string;
  source: 'oauth' | 'cli-bridge';
}

export interface SalesforceApiError {
  message: string;
  errorCode: string;
  fields?: string[];
}

export interface SalesforceCreateResult {
  id: string;
  success: boolean;
  errors: SalesforceApiError[];
}

export interface SalesforceQueryResult<T> {
  totalSize: number;
  done: boolean;
  records: T[];
}

export interface SalesforceVisitorRecord {
  Id: string;
  Name: string;
  Email__c?: string | null;
  Contact_Number__c?: string | null;
  CreatedDate: string;
}

export interface SalesforceEnquiryRecord {
  Id: string;
  Name: string;
  CreatedDate: string;
  [key: string]: unknown;
}

export interface SalesforceAppointmentRecord {
  Id: string;
  Name: string;
  CreatedDate: string;
  [key: string]: unknown;
}

export interface SalesforceFaqRecord {
  Id: string;
  Name: string;
  Question__c: string;
  Answer__c?: string | null;
  Category__c?: string | null;
  Is_Published__c: boolean;
  Display_Order__c?: number | null;
}
