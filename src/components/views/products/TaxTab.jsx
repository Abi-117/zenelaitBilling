import { useState, useEffect } from 'react';
import Card from '../../ui/Card';

const TaxTab = ({ product, onUpdate }) => {
  const [taxData, setTaxData] = useState({
    price: product?.price || 0,
    taxPercent: product?.tax || 0,
    taxInclusive: false,
  });

  const [computed, setComputed] = useState({
    taxAmount: 0,
    totalPrice: 0,
  });

  // Compute tax whenever price, tax, or taxInclusive changes
  useEffect(() => {
    const { price, taxPercent, taxInclusive } = taxData;
    let taxAmount = 0;
    let totalPrice = 0;

    if (taxInclusive) {
      taxAmount = (price * taxPercent) / (100 + taxPercent);
      totalPrice = price;
    } else {
      taxAmount = (price * taxPercent) / 100;
      totalPrice = price + taxAmount;
    }

    setComputed({
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
  }, [taxData]);

  const saveTax = () => {
    console.log('Tax saved:', taxData);
    if (onUpdate) onUpdate(taxData);
    alert('Tax details saved!');
  };

  return (
    <div className="space-y-6">

      {/* Price & Tax Input */}
      <Card>
        <h3 className="font-semibold mb-4">Price & Tax</h3>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="mt-4 flex items-center gap-2">
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
            Price is tax-inclusive
          </label>
        </div>
      </Card>

      {/* Tax Preview */}
      <Card>
        <h3 className="font-semibold mb-2">Tax Preview</h3>
        <p>Tax Amount: <strong>₹{computed.taxAmount}</strong></p>
        <p>Total Price: <strong>₹{computed.totalPrice}</strong></p>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={saveTax}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Tax
        </button>
      </div>
    </div>
  );
};

export default TaxTab;
