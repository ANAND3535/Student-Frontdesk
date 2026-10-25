import { LightningElement } from 'lwc';
import importFaqs from '@salesforce/apex/FAQAdminController.importFaqs';

const TEMPLATE_CSV = [
    'Question,Answer,Category,Published',
    '"How do I reset my password?","Use the Forgot Password link on the sign-in page.",Account,true',
    '"Where can I view invoices?","Open Billing, then select Invoices.",Billing,true',
    '"How do I update my contact details?","Open your profile settings and save the changes.",Account,true',
    '"Which file types are supported?","Check the upload instructions shown on the relevant page.",Technical,true',
    '"How do I contact support?","Use the support contact link in your account.",General,true'
].join('\r\n');

const PREVIEW_COLUMNS = [
    { label: 'Row', fieldName: 'rowNumber', type: 'number', initialWidth: 70 },
    { label: 'Question', fieldName: 'question', type: 'text', wrapText: true },
    { label: 'Category', fieldName: 'category', type: 'text' },
    { label: 'Published', fieldName: 'published', type: 'boolean' }
];

export default class FaqCsvImport extends LightningElement {
    rows = [];
    previewRows = [];
    previewColumns = PREVIEW_COLUMNS;
    localErrors = [];
    errorMessage;
    isImporting = false;
    importResult;

    get templateDownloadUrl() {
        return `data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_CSV)}`;
    }

    get hasPreview() {
        return this.previewRows.length > 0;
    }

    get rowCount() {
        return this.rows.length;
    }

    get disableImport() {
        return this.isImporting || this.rows.length === 0 || Boolean(this.importResult);
    }

    get resultSummary() {
        if (!this.importResult) {
            return '';
        }
        return `${this.importResult.inserted} inserted, ${this.importResult.failed} failed, ${this.importResult.warnings.length} duplicate warnings.`;
    }

    get hasResultErrors() {
        return Boolean(this.importResult?.errors?.length);
    }

    get hasResultWarnings() {
        return Boolean(this.importResult?.warnings?.length);
    }

    handleFileChange(event) {
        const file = event.target.files?.[0];
        this.rows = [];
        this.previewRows = [];
        this.localErrors = [];
        this.importResult = undefined;
        this.errorMessage = undefined;
        if (!file) {
            return;
        }
        if (!file.name.toLocaleLowerCase().endsWith('.csv')) {
            this.errorMessage = 'Choose a .csv file.';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                this.parseFile(String(reader.result || ''));
            } catch (error) {
                this.errorMessage = error.message || 'The CSV file could not be parsed.';
            }
        };
        reader.onerror = () => {
            this.errorMessage = 'The CSV file could not be read as UTF-8.';
        };
        reader.readAsText(file, 'UTF-8');
    }

    parseFile(text) {
        const table = this.parseCsv(text.replace(/^\uFEFF/, ''));
        if (table.length < 2) {
            throw new Error('The CSV must include a header and at least one data row.');
        }
        const headers = table[0].map((header) => header.trim().toLocaleLowerCase());
        const questionIndex = headers.indexOf('question');
        const answerIndex = headers.indexOf('answer');
        const categoryIndex = headers.indexOf('category');
        const publishedIndex = headers.indexOf('published');
        const orderIndex = headers.indexOf('displayorder') >= 0
            ? headers.indexOf('displayorder')
            : headers.indexOf('display_order');
        if (questionIndex < 0 || answerIndex < 0) {
            throw new Error('CSV headers must include Question and Answer.');
        }

        const parsedRows = [];
        const rowErrors = [];
        const sourceRowNumbers = [];
        for (let index = 1; index < table.length; index += 1) {
            const columns = table[index];
            if (columns.every((value) => !value.trim())) {
                continue;
            }
            const rowNumber = index + 1;
            if (columns.length > headers.length && columns.slice(headers.length).some((value) => value.trim())) {
                rowErrors.push(`Row ${rowNumber}: more columns than the CSV header.`);
                continue;
            }
            const publishedText = publishedIndex < 0
                ? ''
                : (columns[publishedIndex] || '').trim().toLocaleLowerCase();
            let published = false;
            if (['true', 'yes', '1'].includes(publishedText)) {
                published = true;
            } else if (publishedText && !['false', 'no', '0'].includes(publishedText)) {
                rowErrors.push(`Row ${rowNumber}: Published must be true, false, yes, or no.`);
                continue;
            }

            const orderText = orderIndex < 0 ? '' : (columns[orderIndex] || '').trim();
            let displayOrder = 100;
            if (orderText) {
                const parsedOrder = Number(orderText);
                if (!Number.isInteger(parsedOrder) || parsedOrder < 0 || parsedOrder > 99999) {
                    rowErrors.push(`Row ${rowNumber}: DisplayOrder must be a whole number from 0 to 99999.`);
                    continue;
                }
                displayOrder = parsedOrder;
            }

            parsedRows.push({
                question: columns[questionIndex] || '',
                answer: columns[answerIndex] || '',
                category: categoryIndex < 0 ? 'General' : (columns[categoryIndex] || 'General'),
                published,
                displayOrder
            });
            sourceRowNumbers.push(rowNumber);
        }
        if (parsedRows.length > 2000) {
            throw new Error('Import no more than 2,000 data rows at a time.');
        }
        if (!parsedRows.length) {
            throw new Error(rowErrors[0] || 'The CSV contains no importable rows.');
        }
        this.rows = parsedRows;
        this.localErrors = rowErrors;
        this.previewRows = parsedRows.slice(0, 10).map((row, index) => ({
            ...row,
            rowNumber: sourceRowNumbers[index]
        }));
        this.errorMessage = rowErrors.length
            ? `${rowErrors.length} row(s) were skipped. ${rowErrors.slice(0, 5).join(' ')}`
            : undefined;
    }

    parseCsv(text) {
        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;
        for (let index = 0; index < text.length; index += 1) {
            const character = text[index];
            if (inQuotes) {
                if (character === '"' && text[index + 1] === '"') {
                    field += '"';
                    index += 1;
                } else if (character === '"') {
                    inQuotes = false;
                } else {
                    field += character;
                }
            } else if (character === '"' && field.length === 0) {
                inQuotes = true;
            } else if (character === ',') {
                row.push(field);
                field = '';
            } else if (character === '\n' || character === '\r') {
                row.push(field);
                field = '';
                rows.push(row);
                row = [];
                if (character === '\r' && text[index + 1] === '\n') {
                    index += 1;
                }
            } else {
                field += character;
            }
        }
        if (inQuotes) {
            throw new Error('The CSV contains an unclosed quoted field.');
        }
        if (field.length > 0 || row.length > 0) {
            row.push(field);
            rows.push(row);
        }
        return rows;
    }

    async handleImport() {
        if (!this.rows.length || this.isImporting) {
            return;
        }
        this.isImporting = true;
        this.errorMessage = undefined;
        try {
            const result = await importFaqs({ rows: this.rows });
            this.importResult = {
                ...result,
                failed: result.failed + this.localErrors.length,
                errors: [...this.localErrors, ...result.errors]
            };
            this.dispatchEvent(
                new CustomEvent('imported', {
                    detail: this.importResult,
                    bubbles: true,
                    composed: true
                })
            );
        } catch (error) {
            this.errorMessage =
                error?.body?.message || error?.message || 'The CSV import failed.';
        } finally {
            this.isImporting = false;
        }
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}
