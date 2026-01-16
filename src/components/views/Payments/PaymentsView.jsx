import { useState } from 'react';
import PaymentsReceivedView from './received/PaymentsReceivedView';
import PaymentLinksView from './links/PaymentLinksView';
import BankReconciliationView from './bank/BankReconciliationView';

const PaymentsView = () => {
  const [tab, setTab] = useState('received');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-slate-500">
          Payments, links & bank reconciliation
        </p>
      </div>

      <div className="flex gap-4 border-b">
        {[
          { id: 'received', label: 'Payments Received' },
          { id: 'links', label: 'Payment Links' },
          { id: 'bank', label: 'Bank Reconciliation' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2 border-b-2 ${
              tab === t.id
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'received' && <PaymentsReceivedView />}
      {tab === 'links' && <PaymentLinksView />}
      {tab === 'bank' && <BankReconciliationView />}
    </div>
  );
};

export default PaymentsView;
