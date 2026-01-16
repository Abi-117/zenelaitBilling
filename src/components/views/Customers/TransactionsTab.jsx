const TransactionsTab = ({ customer }) => {
  const transactions = customer?.transactions || [];

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Transactions</h3>

      {transactions.length === 0 ? (
        <div className="text-slate-500 text-center py-6">
          No transactions found
        </div>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx} className="border-t">
                <td>{t.date}</td>
                <td>{t.type}</td>
                <td>₹{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsTab;
