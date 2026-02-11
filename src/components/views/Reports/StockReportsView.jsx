// StockReportsView.jsx
import React, { useState, useEffect, useMemo } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import ReportHeader from "../../common/ReportHeader";
import EventDetailsModal from "./EventDetailsModal";
import { fetchItems, fetchStockLogs } from "../../../services/api";

// Utility to determine stock status
const getStockStatus = (stock, reorderLevel) => {
  if (stock <= 0) return "Out of Stock"; // negative or zero stock
  if (stock <= reorderLevel) return "Low Stock";
  if (stock > reorderLevel * 2) return "Fast Moving";
  return "Normal";
};

const StockReportsView = () => {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load items and stock logs
  const loadStockData = async () => {
    try {
      setLoading(true);
      const [itemsData, logsData] = await Promise.all([fetchItems(), fetchStockLogs()]);
      setItems(itemsData || []);
      setLogs(logsData || []);
    } catch (err) {
      console.error("Failed to load stock data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
  }, []);

  // Memoized stock calculation per item
  const stockData = useMemo(() => {
    return items.map(item => {
      const rawStock = logs.reduce((total, log) => {
        if (log.item?._id !== item._id) return total;
        return log.type === "IN" ? total + log.quantity : total - log.quantity;
      }, 0);

      const stock = Math.max(0, rawStock); // prevent negative stock display
      const status = getStockStatus(stock, item.reorderLevel || 0);

      return { ...item, stock, status };
    });
  }, [items, logs]);

  // Total stock
  const totalStock = useMemo(() => stockData.reduce((acc, item) => acc + item.stock, 0), [stockData]);

  // Export Excel
  const exportExcel = () => {
    const data = stockData.map(item => ({
      Item: item.name,
      Stock: item.stock,
      Status: item.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Stock_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Report", 14, 16);
    const tableData = stockData.map(item => [item.name, item.stock, item.status]);
    doc.autoTable({
      head: [["Item", "Stock", "Status"]],
      body: tableData,
      startY: 20,
    });
    doc.save(`Stock_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* <ReportHeader title="Stock Report" /> */}

      <div className="flex justify-end gap-2">
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          PDF
        </button>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Excel
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-400">Loading stock data...</p>
      ) : (
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
              {stockData.map(item => {
                let statusColor = "text-slate-600";
                if (item.status === "Out of Stock") statusColor = "text-red-600";
                else if (item.status === "Low Stock") statusColor = "text-amber-600";
                else if (item.status === "Fast Moving") statusColor = "text-green-600";

                return (
                  <tr key={item._id} className="border-b hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium">{item.name}</td>
                    <td className="py-2 px-3">{item.stock}</td>
                    <td className={`py-2 px-3 font-semibold ${statusColor}`}>{item.status}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="border-t font-semibold bg-slate-50">
                <td className="py-2 px-3">Total Stock</td>
                <td className="py-2 px-3">{totalStock}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedItem && (
        <EventDetailsModal
          event={{
            ref: `ITEM-${selectedItem.name}`,
            customer: "Inventory",
            type: selectedItem.name,
            status: selectedItem.status,
            amount: selectedItem.stock,
            message: `Reorder Level: ${selectedItem.reorderLevel || 0}`,
          }}
          onClose={() => setSelectedItem(null)}
          onMarkPaid={(id) => {
            alert(`${id} marked as restocked`);
            setSelectedItem(null);
            loadStockData();
          }}
        />
      )}
    </div>
  );
};

export default StockReportsView;
