const RecurringExpenseView = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold mb-4">
        Recurring Expenses
      </h2>

      <table className="w-full text-sm">
        <thead className="text-slate-500 border-b">
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Next Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id} className="border-b">
              <td>{r.name}</td>
              <td>₹{r.amount}</td>
              <td>{r.frequency}</td>
              <td>{r.nextDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringExpenseView;
