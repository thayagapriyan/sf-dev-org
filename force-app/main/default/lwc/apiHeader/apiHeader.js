import { LightningElement, api } from 'lwc';

export default class ApiHeader extends LightningElement {
    @api apiName = 'loyalty-test-proxy-flex';
    @api apiType = 'HTTP API';
    @api version = '3.0';
    @api versionState = 'Stable';
    @api instances = 2;
    @api clients = 3;
    @api tags = 1;

    handleRequestAccess() {
        // Dispatch custom event for parent component to handle
        this.dispatchEvent(new CustomEvent('requestaccess', {
            detail: {
                apiName: this.apiName,
                timestamp: new Date().toISOString()
            }
        }));
        console.log(`Request access clicked for ${this.apiName}`);
    }
}