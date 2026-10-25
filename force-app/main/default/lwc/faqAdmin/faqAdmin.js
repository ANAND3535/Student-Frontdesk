import { LightningElement } from 'lwc';
import LightningConfirm from 'lightning/confirm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import isAdmin from '@salesforce/apex/FAQAdminController.isAdmin';
import getAllFaqs from '@salesforce/apex/FAQAdminController.getAllFaqs';
import getCategoryValues from '@salesforce/apex/FAQAdminController.getCategoryValues';
import setPublished from '@salesforce/apex/FAQAdminController.setPublished';
import deleteFaq from '@salesforce/apex/FAQAdminController.deleteFaq';

const SEARCH_DELAY = 250;
const ALL_CATEGORIES = { label: 'All categories', value: 'All' };

export default class FaqAdmin extends LightningElement {
    columns = [
        { label: 'Question', fieldName: 'Question__c', type: 'text', wrapText: true },
        { label: 'Category', fieldName: 'Category__c', type: 'text' },
        { label: 'Published', fieldName: 'Is_Published__c', type: 'boolean' },
        { label: 'Display Order', fieldName: 'Display_Order__c', type: 'number' },
        {
            label: 'Last Modified',
            fieldName: 'LastModifiedDate',
            type: 'date',
            typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' }
        },
        { type: 'action', typeAttributes: { rowActions: this.rowActions } }
    ];

    rowActions = (row, doneCallback) => {
        doneCallback([
            { label: 'Edit', name: 'edit' },
            { label: row.Is_Published__c ? 'Unpublish' : 'Publish', name: 'togglePublish' },
            { label: 'Delete', name: 'delete' }
        ]);
    };

    isCheckingAccess = true;
    isAdmin = false;
    records = [];
    categoryOptions = [];
    selectedCategory = 'All';
    searchInput = '';
    searchTerm = '';
    isLoading = false;
    isFormOpen = false;
    isImportOpen = false;
    selectedRecord;
    message;
    messageType = 'success';
    searchTimer;

    connectedCallback() {
        this.checkAccess();
    }

    disconnectedCallback() {
        window.clearTimeout(this.searchTimer);
    }

    get accessDenied() {
        return !this.isCheckingAccess && !this.isAdmin;
    }

    get filterOptions() {
        return [ALL_CATEGORIES, ...this.categoryOptions];
    }

    get filteredRecords() {
        return this.selectedCategory === 'All'
            ? this.records
            : this.records.filter((record) => record.Category__c === this.selectedCategory);
    }

    get hasRows() {
        return this.filteredRecords.length > 0;
    }

    get messageClass() {
        return this.messageType === 'error'
            ? 'slds-notify slds-notify_alert slds-alert_error slds-m-bottom_medium'
            : 'slds-notify slds-notify_alert slds-alert_success slds-m-bottom_medium';
    }

    get messageRole() {
        return this.messageType === 'error' ? 'alert' : 'status';
    }

    async checkAccess() {
        try {
            this.isAdmin = await isAdmin();
            if (!this.isAdmin) {
                return;
            }
            const categories = await getCategoryValues();
            this.categoryOptions = categories.map((value) => ({ label: value, value }));
            await this.loadRecords();
        } catch (error) {
            this.isAdmin = false;
            this.showMessage(this.errorText(error), 'error');
        } finally {
            this.isCheckingAccess = false;
        }
    }

    async loadRecords() {
        this.isLoading = true;
        try {
            this.records = await getAllFaqs({ searchTerm: this.searchTerm }) || [];
            this.message = undefined;
        } catch (error) {
            this.showMessage(this.errorText(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    handleSearchInput(event) {
        this.searchInput = event.target.value;
        window.clearTimeout(this.searchTimer);
        this.searchTimer = window.setTimeout(() => {
            this.searchTerm = this.searchInput.trim();
            this.loadRecords();
        }, SEARCH_DELAY);
    }

    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
    }

    handleNewFaq() {
        this.selectedRecord = undefined;
        this.isFormOpen = true;
    }

    handleOpenImport() {
        this.isImportOpen = true;
    }

    handleCancel() {
        this.isFormOpen = false;
        this.selectedRecord = undefined;
    }

    handleCloseImport() {
        this.isImportOpen = false;
    }

    async handleSaved(event) {
        this.isFormOpen = false;
        this.selectedRecord = undefined;
        const warning = event.detail?.warning;
        this.showToast(
            warning ? 'Saved with warning' : 'FAQ saved',
            warning || 'The FAQ was saved successfully.',
            warning ? 'warning' : 'success'
        );
        await this.loadRecords();
    }

    async handleImported(event) {
        const result = event.detail;
        this.showToast(
            'CSV import complete',
            `${result.inserted} inserted, ${result.failed} failed, ${result.warnings.length} duplicate warnings.`,
            result.failed ? 'warning' : 'success'
        );
        await this.loadRecords();
    }

    async handleRowAction(event) {
        const { action, row } = event.detail;
        if (action.name === 'edit') {
            this.selectedRecord = {
                Id: row.Id,
                Question__c: row.Question__c,
                Answer__c: row.Answer__c,
                Category__c: row.Category__c,
                Is_Published__c: row.Is_Published__c,
                Display_Order__c: row.Display_Order__c
            };
            this.isFormOpen = true;
        } else if (action.name === 'togglePublish') {
            await this.changePublication(row);
        } else if (action.name === 'delete') {
            await this.confirmDelete(row);
        }
    }

    async changePublication(row) {
        try {
            await setPublished({ faqId: row.Id, published: !row.Is_Published__c });
            this.showToast(
                'FAQ updated',
                row.Is_Published__c ? 'FAQ unpublished.' : 'FAQ published.',
                'success'
            );
            await this.loadRecords();
        } catch (error) {
            this.showMessage(this.errorText(error), 'error');
        }
    }

    async confirmDelete(row) {
        const confirmed = await LightningConfirm.open({
            label: 'Delete FAQ',
            message: `Delete “${row.Question__c}”? This cannot be undone.`,
            variant: 'header'
        });
        if (!confirmed) {
            return;
        }
        try {
            await deleteFaq({ faqId: row.Id });
            this.showToast('FAQ deleted', 'The FAQ was deleted.', 'success');
            await this.loadRecords();
        } catch (error) {
            this.showMessage(this.errorText(error), 'error');
        }
    }

    showMessage(message, type) {
        this.message = message;
        this.messageType = type;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    errorText(error) {
        return error?.body?.message || error?.message || 'An unexpected error occurred.';
    }
}
