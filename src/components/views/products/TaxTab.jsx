import { useState, useEffect } from "react";
import Card from "../../ui/Card";

const TaxTab = ({ product, onUpdate }) => {
  /* ---------------- STATE ---------------- */
  const [taxData, setTaxData] = useState({
    price: product?.price || 0,
    taxPercent: product?.tax || 0,
    taxInclusive: false,
  });

  const [computed, setComputed] = useState({
    basePrice: 0,
    taxAmount: 0,
    totalPrice: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  const [errors, setErrors] = useState({});

  /* ---------------- COMPUTE TAX ---------------- */
  useEffect(() => {
    const { price, taxPercent, taxInclusive } = taxData;
    if (!price || price <= 0 || taxPercent < 0) return;

    let basePrice = price;
    let totalTax = 0;

    if (taxInclusive) {
      totalTax = (price * taxPercent) / (100 + taxPercent);
      basePrice = price - totalTax;
    } else {
      totalTax = (price * taxPercent) / 100;
    }

    const cgst = taxPercent <= 28 ? parseFloat((totalTax / 2).toFixed(2)) : 0;
    const sgst = taxPercent <= 28 ? parseFloat((totalTax / 2).toFixed(2)) : 0;
    const igst = taxPercent > 28 ? parseFloat(totalTax.toFixed(2)) : 0;

    setComputed({
      basePrice: parseFloat(basePrice.toFixed(2)),
      taxAmount: parseFloat(totalTax.toFixed(2)),
      totalPrice: parseFloat((basePrice + totalTax).toFixed(2)),
      cgst,
      sgst,
      igst,
    });
  }, [taxData]);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};
    if (!taxData.price || taxData.price <= 0) e.price = "Price must be > 0";
    if (taxData.taxPercent < 0) e.taxPercent = "Tax cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- ACTION ---------------- */
  const handleCheck = () => {
    if (!validate()) return alert("❌ Check fields, some values are invalid.");
    alert("✅ Tax data looks good!");
    if (onUpdate) onUpdate({ ...taxData, computed });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Price & Tax Inputs */}
      <Card>
        <h3 className="font-semibold mb-4">Price & Tax</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Price */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              className="input mt-1"
              value={taxData.price}
              onChange={(e) =>
                setTaxData({ ...taxData, price: Number(e.target.value) })
              }
            />
            {errors.price && (
              <span className="text-xs text-red-500">{errors.price}</span>
            )}
          </div>

          {/* Tax % */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium">Tax (%)</label>
            <input
              type="number"
              className="input mt-1"
              value={taxData.taxPercent}
              onChange={(e) =>
                setTaxData({ ...taxData, taxPercent: Number(e.target.value) })
              }
            />
            {errors.taxPercent && (
              <span className="text-xs text-red-500">{errors.taxPercent}</span>
            )}
          </div>

          {/* Tax Inclusive */}
          <div className="flex items-center mt-6 gap-2">
            <input
              type="checkbox"
              id="taxInclusive"
              checked={taxData.taxInclusive}
              onChange={(e) =>
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

      {/* Tax Preview */}
      <Card>
        <h3 className="font-semibold mb-2">Tax Preview</h3>
        <div className="space-y-1 text-sm">
          <p>Base Price: ₹{computed.basePrice}</p>
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
          onClick={handleCheck}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
        >
          Check Tax
        </button>
      </div>
    </div>
  );
};

export default TaxTab;
