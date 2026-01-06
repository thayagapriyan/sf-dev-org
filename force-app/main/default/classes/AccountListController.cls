/**
 * Apex Controller for the accountList LWC component.
 * Provides methods to retrieve Account records.
 */
public with sharing class AccountListController {
    
    /**
     * Retrieves a list of all accounts with key fields.
     * @return List of Account records
     */
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, Type, Phone, Website, BillingCity, BillingState, AnnualRevenue
            FROM Account
            ORDER BY Name ASC
            LIMIT 200
        ];
    }
    
    /**
     * Searches accounts by name.
     * @param searchKey The search term to filter accounts
     * @return List of matching Account records
     */
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Industry, Type, Phone, Website, BillingCity, BillingState, AnnualRevenue
            FROM Account
            WHERE Name LIKE :key
            ORDER BY Name ASC
            LIMIT 200
        ];
    }
}
