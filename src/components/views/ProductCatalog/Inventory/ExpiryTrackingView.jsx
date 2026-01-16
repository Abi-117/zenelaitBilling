import Card from '../../../ui/Card';
import { AlertTriangle } from 'lucide-react';

const ExpiryTrackingView = () => {
  const today = new Date();

  const batches = [
    {
      item: 'Paracetamol 500mg',
      batch: 'PCM-1024',
      expiry: '2026-10-31',
      qty: 100,
    },
    {
      item: 'Amoxicillin',
      batch: 'AMX-332',
      expiry: '2025-01-20',
      qty: 40,
    },
  ];

  const getStatus = expiry => {
    const exp = new Date(expiry);
    const diff = (exp - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return 'expired';
    if (diff <= 30) return 'warning';
    return 'ok';
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">Expiry Tracking</h3>

      <table className="w-full text-sm">
        <thead className="border-b text-slate-500 text-left">
          <tr>
            <th>Item</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {batches.map((b, i) => {
            const status = getStatus(b.expiry);

            return (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{b.item}</td>
                <td>{b.batch}</td>
                <td>{b.expiry}</td>
                <td>{b.qty}</td>
                <td>
                  {status === 'expired' && (
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <AlertTriangle size={14} /> Expired
                    </span>
                  )}
                  {status === 'warning' && (
                    <span className="text-amber-600 font-semibold">
                      Expiring Soon
                    </span>
                  )}
                  {status === 'ok' && (
                    <span className="text-green-600 font-semibold">
                      Valid
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default ExpiryTrackingView;
