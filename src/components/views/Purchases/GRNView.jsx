import { useState } from 'react';

const GRNView = () => {
  const [grns, setGrns] = useState([
    {
      id: 1,
      supplier: 'ABC Suppliers',
      status: 'Draft',
      items: [
        { itemId: 1, name: 'Printer Paper', qty: 10, cost: 200 },
        { itemId: 2, name: 'Ink', qty: 5, cost: 500 },
      ],
    },
  ]);

  const [stock, setStock] = useState([
    { id: 1, name: 'Printer Paper', qty: 50 },
    { id: 2, name: 'Ink', qty: 20 },
  ]);

  const [purchaseBills, setPurchaseBills] = useState([]);

  const markAsReceived = (grn) => {
    // 🔹 1. STOCK IN
    setStock(prev =>
      prev.map(s => {
        const grnItem = grn.items.find(i => i.itemId === s.id);
        return grnItem
          ? { ...s, qty: s.qty + grnItem.qty }
          : s;
      })
    );

    // 🔹 2. CREATE PURCHASE BILL
    const bill = {
      id: `PB-${Date.now()}`,
      supplier: grn.supplier,
      date: new Date().toLocaleDateString(),
      status: 'Unpaid',
      total: grn.items.reduce(
        (sum, i) => sum + i.qty * i.cost,
        0
      ),
    };

    setPurchaseBills(prev => [...prev, bill]);

    // 🔹 3. UPDATE GRN STATUS
    setGrns(prev =>
      prev.map(g =>
        g.id === grn.id ? { ...g, status: 'Received' } : g
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold mb-4">Goods Received Notes</h2>

      {grns.map(grn => (
        <div key={grn.id} className="border-b py-3 flex justify-between">
          <div>
            <p className="font-semibold">{grn.supplier}</p>
            <p className="text-sm text-slate-500">
              Items: {grn.items.length}
            </p>
          </div>

          {grn.status === 'Draft' ? (
            <button
              onClick={() => markAsReceived(grn)}
              className="bg-emerald-600 text-white px-4 py-1 rounded"
            >
              Mark as Received
            </button>
          ) : (
            <span className="text-emerald-600 font-bold">
              Received
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default GRNView;
