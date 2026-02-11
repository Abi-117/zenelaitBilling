import { useEffect, useState } from "react";
import { QrCode, Barcode } from "lucide-react";
import Card from "../../ui/Card";
import api from "../../../services/api";

const BarcodeTab = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [barcodeData, setBarcodeData] = useState({
    sku: "",
    barcode: "",
    qr: "",
    barcodeImage: "",
    qrImage: "",
  });

  const BACKEND_URL = "http://localhost:5173"; // Local backend

  /* ---------------- FETCH EXISTING DATA ---------------- */
  useEffect(() => {
    if (!product?._id) return;

    const fetchCodes = async () => {
      try {
        const res = await api.get(`/product-codes/${product._id}`);
        if (res.data) {
          setBarcodeData({
            sku: res.data.sku || "",
            barcode: res.data.barcode?.value || "",
            qr: res.data.qr?.value || "",
            barcodeImage: res.data.barcode?.image
              ? `${BACKEND_URL}${res.data.barcode.image}`
              : "",
            qrImage: res.data.qr?.image
              ? `${BACKEND_URL}${res.data.qr.image}`
              : "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCodes();
  }, [product?._id]);

  /* ---------------- AUTO GENERATE ---------------- */
  const generateCodes = async () => {
    const value = barcodeData.sku || `SKU-${Date.now()}`;
    setBarcodeData((prev) => ({
      ...prev,
      barcode: value,
      qr: value,
    }));

    try {
      setLoading(true);
      const res = await api.post("/product-codes/generate", {
        barcode: value,
        qr: value,
      });

      setBarcodeData((prev) => ({
        ...prev,
        barcodeImage: `${BACKEND_URL}${res.data.barcodeImage}`,
        qrImage: `${BACKEND_URL}${res.data.qrImage}`,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate codes");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PRINT ---------------- */
  const printLabels = (copies = 1) => {
    if (!barcodeData.barcodeImage && !barcodeData.qrImage) {
      alert("Generate barcode/QR first");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let labelsHtml = "";
    for (let i = 0; i < copies; i++) {
      labelsHtml += `
        <div class="label">
          <img src="${barcodeData.barcodeImage}" alt="Barcode" />
          <div class="sku">${barcodeData.sku}</div>
        </div>
        <div class="label">
          <img src="${barcodeData.qrImage}" alt="QR Code" />
          <div class="sku">${barcodeData.sku}</div>
        </div>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Labels</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .label { display: inline-block; border: 1px solid #000; padding: 10px; margin: 5px; text-align: center; }
            .label img { max-width: 150px; max-height: 100px; }
            .sku { margin-top: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          ${labelsHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
          onChange={(e) =>
            setBarcodeData({ ...barcodeData, sku: e.target.value })
          }
        />
      </Card>

      {/* Barcode */}
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
        <div className="border rounded-lg h-28 flex items-center justify-center">
          {barcodeData.barcodeImage ? (
            <img
              src={barcodeData.barcodeImage}
              alt="Barcode"
              className="h-20"
            />
          ) : (
            <span className="text-slate-400">Barcode Preview</span>
          )}
        </div>
        <input
          className="input mt-3"
          placeholder="Barcode value"
          value={barcodeData.barcode}
          onChange={(e) =>
            setBarcodeData({ ...barcodeData, barcode: e.target.value })
          }
        />
      </Card>

      {/* QR Code */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <QrCode size={18} /> QR Code
        </h3>
        <div className="border rounded-lg h-28 flex items-center justify-center">
          {barcodeData.qrImage ? (
            <img
              src={barcodeData.qrImage}
              alt="QR Code"
              className="h-24"
            />
          ) : (
            <span className="text-slate-400">QR Code Preview</span>
          )}
        </div>
        <input
          className="input mt-3"
          placeholder="QR value"
          value={barcodeData.qr}
          onChange={(e) =>
            setBarcodeData({ ...barcodeData, qr: e.target.value })
          }
        />
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => printLabels(1)} // 1 copy by default
          className="px-4 py-2 border rounded"
        >
          Print Labels
        </button>
      </div>
    </div>
  );
};

export default BarcodeTab;
