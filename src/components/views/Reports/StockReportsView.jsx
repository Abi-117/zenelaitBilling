// StockReportsView.jsx
import React, { useState } from "react";
import ReportHeader from "../../common/ReportHeader";
import EventDetailsModal from "./EventDetailsModal"; // Reuse modal for item details or invoice

// Dummy stock data
const dummyStockData = [
  { name: "Product A", stock: 120, reorderLevel: 20 },
  { name: "Product B", stock: 5, reorderLevel: 10 },
  { name: "Product C", stock: 0, reorderLevel: 15 },
  { name: "Product D", stock: 60, reorderLevel: 30 },
];

const getStockStatus = (stock, reorderLevel) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= reorderLevel) return "Low Stock";
  if (stock > reorderLevel * 2) return "Fast Moving";
  return "Normal";
};

const StockReportsView = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const totalStock = dummyStockData.reduce((acc, item) => acc + item.stock, 0);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <ReportHeader title="Stock Report" />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="text-left py-2 px-3">Item</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyStockData.map((item, i) => {
              const status = getStockStatus(item.stock, item.reorderLevel);
              let statusColor = "text-slate-600";
              if (status === "Out of Stock") statusColor = "text-red-600";
              else if (status === "Low Stock") statusColor = "text-amber-600";
              else if (status === "Fast Moving") statusColor = "text-green-600";

              return (
                <tr key={i} className="border-b hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium">{item.name}</td>
                  <td className="py-2 px-3">{item.stock}</td>
                  <td className={`py-2 px-3 font-semibold ${statusColor}`}>{status}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert(`Reorder request created for ${item.name}`)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="border-t font-semibold bg-slate-50">
              <td className="py-2 px-3">Total Stock</td>
              <td className="py-2 px-3">{totalStock}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <EventDetailsModal
          event={{
            ref: `ITEM-${selectedItem.name}`,
            customer: "Inventory",
            type: selectedItem.name,
            status: getStockStatus(selectedItem.stock, selectedItem.reorderLevel),
            amount: selectedItem.stock,
            message: `Reorder Level: ${selectedItem.reorderLevel}`,
          }}
          onClose={() => setSelectedItem(null)}
          onMarkPaid={(id) => {
            alert(`${id} marked as restocked`);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default StockReportsView;
