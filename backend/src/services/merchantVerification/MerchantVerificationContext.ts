import { IMerchantDocument } from "../../models/Merchant";

export interface MerchantVerificationContext {
  merchant: IMerchantDocument;
  serviceId?: string;
  paymentMode?: string;
  network?: string;
  provider?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
