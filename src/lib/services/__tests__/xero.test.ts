import { vi, describe, it, expect, beforeEach } from 'vitest';
import { XeroService } from '../xero';
import { TokenSet } from 'openid-client';

vi.mock('openid-client');

describe('XeroService', () => {
  let xeroService: XeroService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    xeroService = new XeroService();
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const mockTokens: TokenSet = {
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
        expires_at: Date.now() + 3600000,
      };

      vi.spyOn(xeroService['client'], 'refresh').mockResolvedValueOnce(mockTokens);

      const result = await xeroService.refreshTokens('old_refresh_token');

      expect(result).toEqual(mockTokens);
      expect(xeroService['client'].refresh).toHaveBeenCalledWith('old_refresh_token');
    });

    it('should throw error on refresh failure', async () => {
      vi.spyOn(xeroService['client'], 'refresh').mockRejectedValueOnce(new Error('Refresh failed'));

      await expect(xeroService.refreshTokens('invalid_token')).rejects.toThrow('Refresh failed');
    });
  });

  describe('createContact', () => {
    it('should create a contact successfully', async () => {
      const mockContact = {
        ContactID: 'contact_mock',
        Name: 'Test User',
        EmailAddress: 'test@example.com',
      };

      vi.spyOn(xeroService['xero'], 'accountingApi').mockResolvedValueOnce({
        createContacts: vi.fn().mockResolvedValueOnce({
          body: { Contacts: [mockContact] },
        }),
      } as any);

      const result = await xeroService.createContact({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(result).toEqual(mockContact);
    });
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const mockInvoice = {
        InvoiceID: 'inv_mock',
        Type: 'ACCREC',
        Contact: { ContactID: 'contact_mock' },
        LineItems: [
          {
            Description: 'Test Product',
            Quantity: 1,
            UnitAmount: 100,
          },
        ],
      };

      vi.spyOn(xeroService['xero'], 'accountingApi').mockResolvedValueOnce({
        createInvoices: vi.fn().mockResolvedValueOnce({
          body: { Invoices: [mockInvoice] },
        }),
      } as any);

      const result = await xeroService.createInvoice({
        contactId: 'contact_mock',
        lineItems: [
          {
            description: 'Test Product',
            quantity: 1,
            unitAmount: 100,
          },
        ],
      });

      expect(result).toEqual(mockInvoice);
    });
  });

  describe('recordPayment', () => {
    it('should record payment successfully', async () => {
      const mockPayment = {
        PaymentID: 'payment_mock',
        Invoice: { InvoiceID: 'inv_mock' },
        Amount: 100,
      };

      vi.spyOn(xeroService['xero'], 'accountingApi').mockResolvedValueOnce({
        createPayment: vi.fn().mockResolvedValueOnce({
          body: { Payments: [mockPayment] },
        }),
      } as any);

      const result = await xeroService.recordPayment({
        invoiceId: 'inv_mock',
        amount: 100,
        account: 'Bank',
      });

      expect(result).toEqual(mockPayment);
    });
  });

  describe('handleSubscriptionInvoice', () => {
    it('should handle subscription invoice successfully', async () => {
      const mockSubscription = {
        id: 'sub_mock',
        customer: 'cus_mock',
        items: {
          data: [
            {
              price: {
                product: 'prod_mock',
                unit_amount: 1000,
              },
              quantity: 1,
            },
          ],
        },
      };

      const mockContact = {
        ContactID: 'contact_mock',
        Name: 'Test User',
      };

      const mockInvoice = {
        InvoiceID: 'inv_mock',
        Type: 'ACCREC',
        Contact: mockContact,
      };

      vi.spyOn(xeroService, 'createContact').mockResolvedValueOnce(mockContact);
      vi.spyOn(xeroService, 'createInvoice').mockResolvedValueOnce(mockInvoice);

      const result = await xeroService.handleSubscriptionInvoice(mockSubscription as any);

      expect(result).toEqual(mockInvoice);
      expect(xeroService.createContact).toHaveBeenCalled();
      expect(xeroService.createInvoice).toHaveBeenCalled();
    });
  });
});
