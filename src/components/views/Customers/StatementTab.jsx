import { useEffect, useState } from "react";

const StatementTab = ({ customer }) => {
  const [statement, setStatement] = useState(null);

  useEffect(() => {
    if (!customer?._id) return;

    fetch(`/api/customers/${customer._id}/statement`)
      .then((res) => res.json())
      .then((data) => setStatement(data))
      .catch((err) => console.error("Failed to fetch statement", err));
  }, [customer._id]);

  return (
    <div>
      <h3 className="font-bold mb-2">Customer Statement</h3>

      <p>Total Outstanding: ₹{customer.outstanding}</p>

      {statement && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Total Paid: ₹{statement.totalPaid}</p>
          <p>Total Billed: ₹{statement.totalBilled}</p>
        </div>
      )}
    </div>
  );
};

export default StatementTab;
