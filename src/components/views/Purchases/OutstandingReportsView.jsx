const OutstandingReportsView = ({ bills }) => {
  const outstanding = bills.filter(b => b.status === 'Unpaid');

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold mb-4">Outstanding Payables</h2>

      {outstanding.map(b => (
        <div key={b.id} className="flex justify-between border-b py-2">
          <span>{b.supplier}</span>
          <span className="font-bold">₹{b.total}</span>
        </div>
      ))}
    </div>
  );
};

export default OutstandingReportsView;
