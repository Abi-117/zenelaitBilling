const StatementTab = ({ customer }) => (
  <div>
    <h3 className="font-bold text-lg mb-2">Customer Statement</h3>
    <p>Total Outstanding: ₹{customer.outstandingBalance}</p>
    {/* Add downloadable PDF or export option later */}
  </div>
);
export default StatementTab;