import { useState } from 'react';
import { QrCode, Barcode } from 'lucide-react';
import Card from '../../ui/Card';

const BarcodeTab = ({ product }) => {
  const [barcodeData, setBarcodeData] = useState({
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    qr: product?.qr || '',
    autoGenerate: true,
  });

  const generateCodes = () => {
    const value = barcodeData.sku || `SKU-${Date.now()}`;

    setBarcodeData({
      ...barcodeData,
      barcode: value,
      qr: value,
    });
  };

  const saveCodes = () => {
    console.log(barcodeData);
    alert('Barcode & QR saved');
  };

  return (
    <div className="space-y-6">

      {/* SKU */}
      <Card>
        <h3 className="font-semibold mb-4">SKU / Item Code</h3>
        <input
          className="input"
          placeholder="Enter SKU"
          value={barcodeData.sku}
          onChange={e =>
            setBarcodeData({ ...barcodeData, sku: e.target.value })
          }
        />
      </Card>

      {/* Barcode Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Barcode size={18} /> Barcode
          </h3>

          <button
            onClick={generateCodes}
            className="text-sm text-blue-600 font-medium"
          >
            Auto Generate
          </button>
        </div>

        <div className="border rounded-lg h-28 flex items-center justify-center text-slate-400">
          Barcode Preview
        </div>

        <input
          className="input mt-3"
          placeholder="Barcode value"
          value={barcodeData.barcode}
          onChange={e =>
            setBarcodeData({ ...barcodeData, barcode: e.target.value })
          }
        />
      </Card>

      {/* QR Code Section */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <QrCode size={18} /> QR Code
        </h3>

        <div className="border rounded-lg h-28 flex items-center justify-center text-slate-400">
          QR Code Preview
        </div>

        <input
          className="input mt-3"
          placeholder="QR value"
          value={barcodeData.qr}
          onChange={e =>
            setBarcodeData({ ...barcodeData, qr: e.target.value })
          }
        />
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded">
          Print Labels
        </button>
        <button
          onClick={saveCodes}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

    </div>
  );
};

export default BarcodeTab;
