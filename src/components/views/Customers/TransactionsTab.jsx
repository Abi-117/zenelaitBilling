const TransactionsTab = ({ customer }) => {
  const ledger = customer.ledger || [];

  if (!ledger.length) {
    return <p className="text-slate-500">No transactions found</p>;
  }

  return (
    <table className="w-full border text-sm">
      <thead>
        <tr>
          <th className="p-2">Date</th>
          <th className="p-2">Type</th>
          <th className="p-2">Debit</th>
          <th className="p-2">Credit</th>
        </tr>
      </thead>
      <tbody>
        {ledger.map((l, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{l.date}</td>
            <td className="p-2">{l.type}</td>
            <td className="p-2">₹{l.debit}</td>
            <td className="p-2">₹{l.credit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTab;
