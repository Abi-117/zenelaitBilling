import { useState } from 'react';
import { PackageCheck, Truck, FileText } from 'lucide-react';

const GRNView = () => {
  const [grns, setGrns] = useState([
    {
      id: 'GRN-1001',
      supplier: 'ABC Suppliers',
      poNo: 'PO-21001',
      date: '2026-01-12',
      status: 'Draft',
      purchaseBillId: null,
      taxRate: 18,
      items: [
        { id: 1, name: 'Printer Paper A4', qty: 50, rate: 180 },
        { id: 2, name: 'Ink Cartridge HP', qty: 30, rate: 520 },
        { id: 3, name: 'Stapler', qty: 10, rate: 150 },
      ],
    },
    {
      id: 'GRN-1002',
      supplier: 'Metro Steels',
      poNo: 'PO-21002',
      date: '2026-01-15',
      status: 'Billed',
      purchaseBillId: 'PB-2001',
      taxRate: 18,
      items: [
        { id: 4, name: 'Steel Rod 12mm', qty: 60, rate: 1150 },
        { id: 5, name: 'Steel Sheet 6mm', qty: 30, rate: 980 },
      ],
    },
    {
      id: 'GRN-1003',
      supplier: 'TechZone Pvt Ltd',
      poNo: 'PO-21003',
      date: '2026-01-18',
      status: 'Draft',
      purchaseBillId: null,
      taxRate: 18,
      items: [
        { id: 6, name: 'Laptop Charger', qty: 15, rate: 2200 },
        { id: 7, name: 'HDMI Cable', qty: 25, rate: 450 },
        { id: 8, name: 'Keyboard', qty: 20, rate: 850 },
      ],
    },
    {
      id: 'GRN-1004',
      supplier: 'OfficeMart',
      poNo: 'PO-21004',
      date: '2026-01-20',
      status: 'Billed',
      purchaseBillId: 'PB-2002',
      taxRate: 18,
      items: [
        { id: 9, name: 'Office Chair', qty: 8, rate: 5200 },
        { id: 10, name: 'Desk Lamp', qty: 12, rate: 950 },
      ],
    },
    {
      id: 'GRN-1005',
      supplier: 'PowerGrid Electricals',
      poNo: 'PO-21005',
      date: '2026-01-22',
      status: 'Draft',
      purchaseBillId: null,
      taxRate: 18,
      items: [
        { id: 11, name: 'Copper Wire Roll', qty: 5, rate: 7800 },
        { id: 12, name: 'Switch Board', qty: 30, rate: 320 },
      ],
    },
    {
      id: 'GRN-1006',
      supplier: 'Packaging World',
      poNo: 'PO-21006',
      date: '2026-01-25',
      status: 'Billed',
      purchaseBillId: 'PB-2003',
      taxRate: 12,
      items: [
        { id: 13, name: 'Corrugated Box', qty: 200, rate: 45 },
        { id: 14, name: 'Bubble Wrap Roll', qty: 10, rate: 850 },
      ],
    },
  ]);

  const [selectedGRN, setSelectedGRN] = useState(null);

  const calculateSubtotal = items => items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const calculateTax = (subtotal, rate) => (subtotal * rate) / 100;

  const convertToPurchaseBill = grn => {
    if (grn.status === 'Billed') return;

    const pbId = `PB-${Date.now()}`;
    setGrns(prev =>
      prev.map(g =>
        g.id === grn.id ? { ...g, status: 'Billed', purchaseBillId: pbId } : g
      )
    );
    setSelectedGRN({ ...grn, status: 'Billed', purchaseBillId: pbId });
  };

  return (
    <div className="flex gap-6 p-6">

      {/* LEFT PANEL – GRN LIST */}
      <div className="w-2/3">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Truck size={18} /> Goods Received Notes
        </h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3 text-left">GRN No</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {grns.map(grn => {
                const subtotal = calculateSubtotal(grn.items);
                const total = subtotal + calculateTax(subtotal, grn.taxRate);
                return (
                  <tr key={grn.id} onClick={() => setSelectedGRN(grn)} className="border-b hover:bg-slate-50 cursor-pointer">
                    <td className="p-3 font-medium">{grn.id}</td>
                    <td className="p-3">{grn.supplier}</td>
                    <td className="p-3">{grn.date}</td>
                    <td className="p-3 text-right font-semibold">₹{total}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${grn.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {grn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT PANEL – GRN DETAILS */}
      {selectedGRN && (
        <div className="w-1/3 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{selectedGRN.id}</h3>
            <button onClick={() => setSelectedGRN(null)} className="text-sm text-slate-500">Close</button>
          </div>

          <div className="text-sm space-y-1 mb-2">
            <p><b>Supplier:</b> {selectedGRN.supplier}</p>
            <p><b>PO No:</b> {selectedGRN.poNo}</p>
            <p><b>Date:</b> {selectedGRN.date}</p>
          </div>

          <table className="w-full text-sm border-t mb-2">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left">Item</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {selectedGRN.items.map(i => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td className="text-center">{i.qty}</td>
                  <td className="text-right">₹{i.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALS */}
          {(() => {
            const subtotal = calculateSubtotal(selectedGRN.items);
            const tax = calculateTax(subtotal, selectedGRN.taxRate);
            return (
              <div className="border-t pt-2 space-y-1 text-sm">
                <p className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></p>
                <p className="flex justify-between"><span>GST ({selectedGRN.taxRate}%)</span><span>₹{tax}</span></p>
                <p className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{subtotal + tax}</span></p>
              </div>
            );
          })()}

          {selectedGRN.status === 'Draft' && (
            <button onClick={() => convertToPurchaseBill(selectedGRN)} className="w-full bg-emerald-600 text-white py-2 mt-3 rounded-lg flex items-center justify-center gap-2">
              <PackageCheck size={16} /> Convert to Purchase Bill
            </button>
          )}

          {selectedGRN.status === 'Billed' && (
            <div className="mt-2 text-emerald-600 font-bold flex items-center gap-2">
              <FileText size={14} /> Purchase Bill Created ({selectedGRN.purchaseBillId})
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GRNView;
