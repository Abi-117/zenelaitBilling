// CustomersList.jsx
const CustomersList = ({ customers, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 font-bold">All Customers</div>

      {customers.map(c => (
        <div
          key={c.id}
          onClick={() => onSelect(c)}
          className="px-4 py-3 cursor-pointer hover:bg-slate-100 border-b"
        >
          <p className="font-medium text-blue-600">{c.name}</p>
          <p className="text-xs text-slate-500">₹{c.outstanding || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomersList;
