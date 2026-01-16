const CustomerForm = () => {
  return (
    <div className="max-w-3xl p-6">
      <h2 className="text-xl font-bold mb-4">New Customer</h2>

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="First Name" className="input" />
        <input placeholder="Last Name" className="input" />
        <input placeholder="Company Name" className="input col-span-2" />
        <input placeholder="GSTIN" className="input col-span-2" />
        <input placeholder="Email" className="input col-span-2" />
      </div>

      <div className="mt-6">
        <button className="bg-emerald-600 text-white px-6 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;
