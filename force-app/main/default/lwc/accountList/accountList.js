import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/AccountListController.getAccounts';
import searchAccounts from '@salesforce/apex/AccountListController.searchAccounts';

// Column definitions for the datatable
const COLUMNS = [
    { 
        label: 'Account Name', 
        fieldName: 'Name', 
        type: 'button',
        typeAttributes: {
            label: { fieldName: 'Name' },
            name: 'view_record',
            variant: 'base'
        },
        sortable: true 
    },
    { label: 'Industry', fieldName: 'Industry', type: 'text', sortable: true },
    { label: 'Type', fieldName: 'Type', type: 'text', sortable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Website', fieldName: 'Website', type: 'url', typeAttributes: { target: '_blank' } },
    { label: 'City', fieldName: 'BillingCity', type: 'text' },
    { label: 'State', fieldName: 'BillingState', type: 'text' },
    { 
        label: 'Annual Revenue', 
        fieldName: 'AnnualRevenue', 
        type: 'currency',
        typeAttributes: { currencyCode: 'USD' },
        sortable: true 
    }
];

export default class AccountList extends NavigationMixin(LightningElement) {
    @track accounts = [];
    @track error;
    @track isLoading = true;
    @track searchKey = '';
    
    columns = COLUMNS;
    delayTimeout;

    // Wire service to get accounts
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = [];
        }
    }

    // Computed property to check if there are accounts
    get hasAccounts() {
        return this.accounts && this.accounts.length > 0;
    }

    // Computed property to get account count
    get accountCount() {
        return this.accounts ? this.accounts.length : 0;
    }

    // Computed property to get error message
    get errorMessage() {
        if (this.error) {
            return this.error.body ? this.error.body.message : this.error.message;
        }
        return '';
    }

    // Handle search input with debounce
    handleSearch(event) {
        const searchValue = event.target.value;
        this.searchKey = searchValue;

        // Clear the previous timeout
        if (this.delayTimeout) {
            clearTimeout(this.delayTimeout);
        }

        // Debounce the search (wait 300ms after user stops typing)
        this.delayTimeout = setTimeout(() => {
            this.performSearch(searchValue);
        }, 300);
    }

    // Perform the actual search
    async performSearch(searchValue) {
        this.isLoading = true;
        try {
            if (searchValue && searchValue.length > 0) {
                this.accounts = await searchAccounts({ searchKey: searchValue });
            } else {
                this.accounts = await getAccounts();
            }
            this.error = undefined;
        } catch (error) {
            this.error = error;
            this.accounts = [];
        } finally {
            this.isLoading = false;
        }
    }

    // Handle row action (clicking on account name to navigate)
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view_record') {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Id,
                    objectApiName: 'Account',
                    actionName: 'view'
                }
            });
        }
    }
}
