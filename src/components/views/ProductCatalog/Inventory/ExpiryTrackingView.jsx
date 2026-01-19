import { useState, useEffect } from 'react';
import Card from '../../../ui/Card';
import { AlertTriangle } from 'lucide-react';

const ExpiryTrackingView = () => {
  const [batches, setBatches] = useState([
    { item: 'Paracetamol 500mg', batch: 'PCM-1024', expiry: '2026-10-31', qty: 100 },
    { item: 'Amoxicillin 250mg', batch: 'AMX-332', expiry: '2025-01-20', qty: 40 },
    { item: 'Vitamin C Tablets', batch: 'VTC-201', expiry: '2026-05-15', qty: 50 },
    { item: 'Cough Syrup 100ml', batch: 'CS-110', expiry: '2024-12-01', qty: 25 },
    { item: 'Ibuprofen 400mg', batch: 'IBF-408', expiry: '2025-02-28', qty: 75 },
  ]);

  const today = new Date();

  // Determine status based on expiry date
  const getStatus = (expiry) => {
    const exp = new Date(expiry);
    const diff = (exp - today) / (1000 * 60 * 60 * 24); // difference in days

    if (diff < 0) return 'expired';
    if (diff <= 30) return 'warning';
    return 'ok';
  };

  return (
    <Card>
      <h3 className="font-semibold mb-4">Expiry Tracking</h3>

      <table className="w-full text-sm border-collapse">
        <thead className="border-b text-slate-500 text-left">
          <tr>
            <th className="py-2">Item</th>
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
              <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition">
                <td className="py-2">{b.item}</td>
                <td>{b.batch}</td>
                <td>{b.expiry}</td>
                <td>{b.qty}</td>
                <td>
                  {status === 'expired' && (
                    <span className="flex items-center gap-1 text-red-600 font-semibold text-xs">
                      <AlertTriangle size={14} /> Expired
                    </span>
                  )}
                  {status === 'warning' && (
                    <span className="text-amber-600 font-semibold text-xs">
                      Expiring Soon
                    </span>
                  )}
                  {status === 'ok' && (
                    <span className="text-green-600 font-semibold text-xs">
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
