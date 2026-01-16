import { useState } from 'react';
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
      { id: 1, label: 'Retail', price: '' },
    ]
  );

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now(), label: '', price: '' },
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
    console.log({
      pricing,
      variants,
    });
    alert('Pricing saved');
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
          {variants.map(variant => (
            <div
              key={variant.id}
              className="grid grid-cols-3 gap-3 items-center"
            >
              <input
                className="input"
                placeholder="Label (Retail / Wholesale)"
                value={variant.label}
                onChange={e =>
                  updateVariant(variant.id, 'label', e.target.value)
                }
              />

              <input
                type="number"
                className="input"
                placeholder="Price"
                value={variant.price}
                onChange={e =>
                  updateVariant(variant.id, 'price', e.target.value)
                }
              />

              <button
                onClick={() => removeVariant(variant.id)}
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Pricing
        </button>
      </div>

    </div>
  );
};

export default PricingTab;
