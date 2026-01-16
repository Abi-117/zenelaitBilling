const ProductForm = ({ data, onSave, onCancel }) => {
  const [form, setForm] = useState(data || {
    name: '',
    type: 'Service',
    sku: '',
    hsn: '',
    unit: 'pcs',
    status: 'Active',
  });

  return (
    <form className="space-y-3">
      <input className="input" placeholder="Item Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <select className="input"
        value={form.type}
        onChange={e => setForm({ ...form, type: e.target.value })}
      >
        <option>Service</option>
        <option>Product</option>
      </select>

      <input className="input" placeholder="SKU"
        value={form.sku}
        onChange={e => setForm({ ...form, sku: e.target.value })}
      />

      <input className="input" placeholder="HSN"
        value={form.hsn}
        onChange={e => setForm({ ...form, hsn: e.target.value })}
      />

      <select className="input"
        value={form.unit}
        onChange={e => setForm({ ...form, unit: e.target.value })}
      >
        <option>pcs</option>
        <option>kg</option>
        <option>ltr</option>
        <option>hour</option>
      </select>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} type="button">Cancel</button>
        <button
          onClick={() => onSave(form)}
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
