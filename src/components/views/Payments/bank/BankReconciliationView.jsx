const entries = [
  { date: '12 Jan 2026', desc: 'UPI – Stark', amount: 3200, matched: true },
  { date: '13 Jan 2026', desc: 'Unknown Credit', amount: 1500, matched: false }
];

const BankReconciliationView = () => {
  return (
    <div className="bg-white border rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-3">Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{e.date}</td>
              <td>{e.desc}</td>
              <td className="font-semibold">₹{e.amount}</td>
              <td>
                {e.matched ? (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                    Matched
                  </span>
                ) : (
                  <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Match
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankReconciliationView;
