import { useState, useEffect } from 'react';
import Card from '../../ui/Card';

const TaxTab = ({ product, onUpdate }) => {
  // Base price & tax inputs
  const [taxData, setTaxData] = useState({
    price: product?.price || 0,
    taxPercent: product?.tax || 0,
    taxInclusive: false,
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  // Computed values
  const [computed, setComputed] = useState({
    taxAmount: 0,
    totalPrice: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  // Compute tax whenever input changes
  useEffect(() => {
    const { price, taxPercent, taxInclusive } = taxData;
    let totalTax = 0;
    let basePrice = price;

    if (taxInclusive) {
      totalTax = (price * taxPercent) / (100 + taxPercent);
      basePrice = price - totalTax;
    } else {
      totalTax = (price * taxPercent) / 100;
    }

    // Split for India GST (50% CGST, 50% SGST) if tax < 28%, otherwise IGST
    const cgst = taxPercent <= 28 ? parseFloat((totalTax / 2).toFixed(2)) : 0;
    const sgst = taxPercent <= 28 ? parseFloat((totalTax / 2).toFixed(2)) : 0;
    const igst = taxPercent > 28 ? parseFloat(totalTax.toFixed(2)) : 0;

    setComputed({
      taxAmount: parseFloat(totalTax.toFixed(2)),
      totalPrice: parseFloat((basePrice + totalTax).toFixed(2)),
      cgst,
      sgst,
      igst,
    });
  }, [taxData]);

  const saveTax = () => {
    if (taxData.price <= 0) return alert('Price must be greater than 0');
    console.log('Saved Tax Data:', { ...taxData, computed });
    if (onUpdate) onUpdate({ ...taxData, computed });
    alert('Tax details saved!');
  };

  return (
    <div className="space-y-6">

      {/* Price & Tax Inputs */}
      <Card>
        <h3 className="font-semibold mb-4">Price & Tax</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              className="input mt-1"
              value={taxData.price}
              onChange={e =>
                setTaxData({ ...taxData, price: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tax (%)</label>
            <input
              type="number"
              className="input mt-1"
              value={taxData.taxPercent}
              onChange={e =>
                setTaxData({ ...taxData, taxPercent: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center mt-6 gap-2">
            <input
              type="checkbox"
              id="taxInclusive"
              checked={taxData.taxInclusive}
              onChange={e =>
                setTaxData({ ...taxData, taxInclusive: e.target.checked })
              }
              className="form-checkbox"
            />
            <label htmlFor="taxInclusive" className="text-sm">
              Tax Inclusive
            </label>
          </div>
        </div>
      </Card>

      {/* Tax Breakdown */}
      <Card>
        <h3 className="font-semibold mb-2">Tax Preview</h3>
        <div className="space-y-1 text-sm">
          <p>Base Price: ₹{(taxData.price - computed.taxAmount).toFixed(2)}</p>
          {computed.cgst > 0 && <p>CGST: ₹{computed.cgst}</p>}
          {computed.sgst > 0 && <p>SGST: ₹{computed.sgst}</p>}
          {computed.igst > 0 && <p>IGST: ₹{computed.igst}</p>}
          <p className="font-bold">Total Tax: ₹{computed.taxAmount}</p>
          <p className="font-bold text-lg">Total Price: ₹{computed.totalPrice}</p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={saveTax}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Tax
        </button>
      </div>
    </div>
  );
};

export default TaxTab;
