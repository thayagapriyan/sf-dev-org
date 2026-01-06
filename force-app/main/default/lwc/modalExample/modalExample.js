import { LightningElement, track, api } from 'lwc';

export default class ModalExample extends LightningElement {
    @track isModalOpen = false;
    @api modalTitle = 'Confirm Action';
    @api modalContent = 'Are you sure you want to proceed with this action?';

    handleOpenModal() {
        this.isModalOpen = true;
        console.log('Modal opened');
    }

    handleCloseModal() {
        this.isModalOpen = false;
        console.log('Modal closed');
    }

    handleConfirm() {
        console.log('Confirmed action');
        this.dispatchEvent(new CustomEvent('confirm', {
            detail: {
                action: 'confirmed',
                timestamp: new Date().toISOString()
            }
        }));
        this.handleCloseModal();
    }
}