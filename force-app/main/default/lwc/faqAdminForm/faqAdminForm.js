import { LightningElement, api } from 'lwc';
import saveFaq from '@salesforce/apex/FAQAdminController.saveFaq';

export default class FaqAdminForm extends LightningElement {
    @api categoryOptions = [];

    formData = this.defaultRecord();
    isSaving = false;
    errorMessage;

    @api
    get record() {
        return this.formData;
    }

    set record(value) {
        this.formData = value ? { ...value } : this.defaultRecord();
    }

    get modalTitle() {
        return this.formData.Id ? 'Edit FAQ' : 'New FAQ';
    }

    handleQuestionChange(event) {
        this.formData = { ...this.formData, Question__c: event.target.value };
    }

    handleAnswerChange(event) {
        this.formData = { ...this.formData, Answer__c: event.target.value };
    }

    handleCategoryChange(event) {
        this.formData = { ...this.formData, Category__c: event.detail.value };
    }

    handleDisplayOrderChange(event) {
        const value = event.target.value;
        this.formData = {
            ...this.formData,
            Display_Order__c: value === '' ? null : Number(value)
        };
    }

    handlePublishedChange(event) {
        this.formData = { ...this.formData, Is_Published__c: event.target.checked };
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    async handleSave() {
        let isValid = true;
        this.template
            .querySelectorAll('lightning-input, lightning-combobox, lightning-input-rich-text')
            .forEach((input) => {
                if (typeof input.reportValidity === 'function' && !input.reportValidity()) {
                    isValid = false;
                }
            });
        const answerText = (this.formData.Answer__c || '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;|&#160;|&#xA0;/gi, '')
            .replace(/\u00a0/g, '')
            .trim();
        if (!answerText) {
            this.errorMessage = 'Enter an answer with text.';
            isValid = false;
        }
        if (!isValid) {
            return;
        }

        this.isSaving = true;
        this.errorMessage = undefined;
        try {
            const result = await saveFaq({ faq: this.formData });
            this.dispatchEvent(
                new CustomEvent('saved', {
                    detail: { warning: result?.warning },
                    bubbles: true,
                    composed: true
                })
            );
        } catch (error) {
            this.errorMessage =
                error?.body?.message || error?.message || 'The FAQ could not be saved.';
        } finally {
            this.isSaving = false;
        }
    }

    defaultRecord() {
        return {
            Question__c: '',
            Answer__c: '',
            Category__c: 'General',
            Display_Order__c: 100,
            Is_Published__c: false
        };
    }
}
