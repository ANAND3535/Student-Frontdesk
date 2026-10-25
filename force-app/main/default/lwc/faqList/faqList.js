import { LightningElement } from 'lwc';
import getPublishedFaqs from '@salesforce/apex/FAQPublicController.getPublishedFaqs';

const REFRESH_INTERVAL = 60000;
const SEARCH_DELAY = 250;

export default class FaqList extends LightningElement {
    faqs = [];
    isLoading = true;
    errorMessage;
    selectedCategory = 'All';
    searchTerm = '';
    pendingSearchTerm = '';
    refreshTimer;
    searchTimer;

    connectedCallback() {
        this.loadFaqs();
        this.refreshTimer = window.setInterval(() => this.loadFaqs(), REFRESH_INTERVAL);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    disconnectedCallback() {
        window.clearInterval(this.refreshTimer);
        window.clearTimeout(this.searchTimer);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    get categoryFilters() {
        const categories = ['All', ...new Set(this.faqs.map((faq) => faq.category).filter(Boolean))];
        return categories.map((value) => {
            const selected = value === this.selectedCategory;
            return {
                value,
                label: value,
                selected,
                className: selected
                    ? 'slds-button slds-button_brand slds-m-right_x-small slds-m-bottom_x-small'
                    : 'slds-button slds-button_neutral slds-m-right_x-small slds-m-bottom_x-small'
            };
        });
    }

    get visibleFaqs() {
        const needle = this.searchTerm.toLocaleLowerCase();
        return this.faqs
            .filter((faq) => this.selectedCategory === 'All' || faq.category === this.selectedCategory)
            .filter((faq) => !needle || faq.question.toLocaleLowerCase().includes(needle))
            .map((faq) => ({
                ...faq,
                panelId: `faq-answer-${faq.id}`,
                iconName: faq.expanded ? 'utility:chevrondown' : 'utility:chevronright',
                toggleLabel: faq.expanded ? 'Collapse answer' : 'Expand answer'
            }));
    }

    get hasFaqs() {
        return this.visibleFaqs.length > 0;
    }

    get showEmpty() {
        return !this.isLoading && !this.errorMessage && !this.hasFaqs;
    }

    handleSearchInput(event) {
        this.pendingSearchTerm = event.target.value || '';
        window.clearTimeout(this.searchTimer);
        this.searchTimer = window.setTimeout(() => {
            this.searchTerm = this.pendingSearchTerm.trim();
        }, SEARCH_DELAY);
    }

    handleCategoryClick(event) {
        this.selectedCategory = event.currentTarget.dataset.category;
    }

    handleToggle(event) {
        const faqId = event.currentTarget.dataset.id;
        this.faqs = this.faqs.map((faq) =>
            faq.id === faqId ? { ...faq, expanded: !faq.expanded } : faq
        );
    }

    handleVisibilityChange = () => {
        if (!document.hidden) {
            this.loadFaqs();
        }
    };

    async loadFaqs() {
        try {
            const records = await getPublishedFaqs();
            this.faqs = (records || []).map((record) => {
                const previous = this.faqs.find((faq) => faq.id === record.id);
                return {
                    ...record,
                    id: record.id,
                    question: record.question,
                    answer: record.answer,
                    category: record.category || 'Other',
                    expanded: previous ? previous.expanded : false
                };
            });
            if (
                this.selectedCategory !== 'All' &&
                !this.faqs.some((faq) => faq.category === this.selectedCategory)
            ) {
                this.selectedCategory = 'All';
            }
            this.errorMessage = undefined;
        } catch (error) {
            this.errorMessage =
                error?.body?.message || error?.message || 'FAQs could not be loaded. Refresh the page to try again.';
        } finally {
            this.isLoading = false;
        }
    }
}
