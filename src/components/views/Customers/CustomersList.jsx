const CustomersList = ({ customers, onSelect, selectedCustomer }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 font-bold">All Customers</div>

      {customers.length === 0 && (
        <p className="text-sm text-gray-400 p-4">No customers found</p>
      )}

      {customers.map((c, index) => (
        <div
          key={c._id || c.id || index}   // ✅ FIX
          onClick={() => onSelect(c)}
          className={`px-4 py-3 cursor-pointer border-b hover:bg-slate-100 ${
            selectedCustomer?._id === c._id ? "bg-emerald-100" : ""
          }`}
        >
          <p className="font-medium text-blue-600">{c.name}</p>
          <p className="text-xs text-slate-500">
            Outstanding: ₹{c.outstanding ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CustomersList;
