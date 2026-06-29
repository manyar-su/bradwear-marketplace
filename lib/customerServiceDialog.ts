export const CUSTOMER_SERVICE_DIALOG_EVENT = 'bradwear:open-cs-picker';

export type CustomerServiceDialogDetail = {
  message: string;
  title?: string;
  description?: string;
};

export const openCustomerServiceDialog = (detail: CustomerServiceDialogDetail) => {
  window.dispatchEvent(new CustomEvent(CUSTOMER_SERVICE_DIALOG_EVENT, { detail }));
};
