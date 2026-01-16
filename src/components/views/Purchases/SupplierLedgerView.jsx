const SupplierLedgerView = ({ bills }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold mb-4">Supplier Ledger</h2>

      {bills.map(b => (
        <div key={b.id} className="border-b py-2 flex justify-between">
          <span>{b.supplier}</span>
          <span className="text-red-600">₹{b.total}</span>
        </div>
      ))}
    </div>
  );
};

export default SupplierLedgerView;
