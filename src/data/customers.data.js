export const INITIAL_CUSTOMERS = [
  {
    id: 1,

    /* BASIC INFO */
    name: 'Zenelait Technologies',
    email: 'billing@zenelait.com',
    phone: '9876543210',
    segment: 'Enterprise',
    status: 'Active',

    /* GST & BILLING */
    gstin: '33ABCDE1234F1Z5',
    taxPreference: 'GST',
    billingAddress: 'Chennai, Tamil Nadu',
    defaultCurrency: 'INR',

    /* CREDIT & BALANCE */
    creditLimit: 200000,
    creditUsed: 85000,
    outstanding: 42000,
    openingBalance: 0,
    isBlocked: false,

    /* TERMS */
    paymentTerms: 'Net 30',

    /* BUSINESS METRICS */
    ltv: 520000,
    creditScore: 'A+',
    lastTransactionDate: '20 Jan 2026',

    /* SALES */
    salesHistory: [
      { id: 'INV-101', date: '12 Jan 2026', amount: 25000, status: 'Paid' },
      { id: 'INV-108', date: '20 Jan 2026', amount: 42000, status: 'Due' }
    ],

    /* LEDGER */
    ledger: [
      { type: 'Invoice', ref: 'INV-108', debit: 42000, credit: 0, date: '20 Jan 2026' },
      { type: 'Payment', ref: 'PAY-22', debit: 0, credit: 25000, date: '12 Jan 2026' }
    ],

    /* CONTACT PERSONS */
    contacts: [
      {
        name: 'Accounts Team',
        email: 'accounts@zenelait.com',
        phone: '9876500000'
      }
    ],

    /* ACTIVITY */
    activityLog: [
      { type: 'Invoice Created', desc: 'INV-108 for ₹42,000', date: '20 Jan 2026' },
      { type: 'Payment Received', desc: '₹25,000 via UPI', date: '12 Jan 2026' }
    ],

    /* SYSTEM */
    notes: 'Priority enterprise customer',
    createdAt: '01 Jan 2026'
  }
];
