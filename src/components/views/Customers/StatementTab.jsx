const StatementTab = ({ customer }) => (
  <div>
    <h3 className="font-bold mb-2">Customer Statement</h3>
    <p>Total Outstanding: ₹{customer.outstanding}</p>
  </div>
);

export default StatementTab;
