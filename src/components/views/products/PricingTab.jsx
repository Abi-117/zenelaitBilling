import { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

const PricingTab = ({ product }) => {
  const [pricing, setPricing] = useState({
    cost: product?.pricing?.cost || '',
    selling: product?.pricing?.selling || '',
    mrp: product?.pricing?.mrp || '',
  });

  const [variants, setVariants] = useState(
    product?.pricing?.variants || [
      { id: 1, label: 'Retail', selling: '', mrp: '' },
      { id: 2, label: 'Wholesale', selling: '', mrp: '' },
    ]
  );

  const [profitMargins, setProfitMargins] = useState({});

  useEffect(() => {
    const margins = {};
    variants.forEach(v => {
      const variantSelling = parseFloat(v.selling || pricing.selling) || 0;
      const cost = parseFloat(pricing.cost) || 0;
      margins[v.id] = cost > 0 ? (((variantSelling - cost) / cost) * 100).toFixed(1) : '0';
    });
    setProfitMargins(margins);
  }, [variants, pricing]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now(), label: '', selling: '', mrp: '' },
    ]);
  };

  const updateVariant = (id, field, value) => {
    setVariants(
      variants.map(v =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const removeVariant = id => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const savePricing = () => {
    if (!pricing.cost || !pricing.selling || !pricing.mrp) {
      return alert('Please fill all base pricing fields');
    }
    for (let v of variants) {
      if (!v.label) return alert('Variant label is required');
    }

    console.log({ pricing, variants, profitMargins });
    alert('Pricing saved successfully');
  };

  return (
    <div className="space-y-6">

      {/* Base Pricing */}
      <Card>
        <h3 className="font-semibold mb-4">Base Pricing</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            className="input"
            placeholder="Cost Price"
            value={pricing.cost}
            onChange={e => setPricing({ ...pricing, cost: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Selling Price"
            value={pricing.selling}
            onChange={e => setPricing({ ...pricing, selling: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="MRP"
            value={pricing.mrp}
            onChange={e => setPricing({ ...pricing, mrp: e.target.value })}
          />
        </div>
      </Card>

      {/* Price Variants */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Price Variations</h3>
          <button
            onClick={addVariant}
            className="flex items-center gap-1 text-blue-600 text-sm"
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variants.map(v => (
            <div key={v.id} className="grid grid-cols-5 gap-3 items-center">
              <input
                className="input"
                placeholder="Label (Retail / Wholesale)"
                value={v.label}
                onChange={e => updateVariant(v.id, 'label', e.target.value)}
              />
              <input
                type="number"
                className="input"
                placeholder="Selling Price"
                value={v.selling || pricing.selling}
                onChange={e => updateVariant(v.id, 'selling', e.target.value)}
              />
              <input
                type="number"
                className="input"
                placeholder="MRP"
                value={v.mrp || pricing.mrp}
                onChange={e => updateVariant(v.id, 'mrp', e.target.value)}
              />
              <div className="text-slate-500 font-semibold">
                Profit: {profitMargins[v.id] ?? 0}%
              </div>
              <button
                onClick={() => removeVariant(v.id)}
                className="text-rose-500 hover:bg-rose-50 p-2 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      <div className="text-right">
        <button
          onClick={savePricing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Pricing
        </button>
      </div>
    </div>
  );
};

export default PricingTab;
