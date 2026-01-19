
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a professional invoice PDF
 * @param {Object} invoice - Invoice data
 */
export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF("p", "pt");

  // ===== HEADER =====
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // blue header
  doc.text("INVOICE", 40, 40);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice No: ${invoice.id}`, 40, 60);
  doc.text(`Date: ${invoice.date}`, 40, 75);
  doc.text(`Status: ${invoice.status}`, 40, 90);

  // ===== CUSTOMER INFO =====
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 40, 120);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.customerName, 40, 135);
  if (invoice.gstin) doc.text(`GSTIN: ${invoice.gstin}`, 40, 150);

  // ===== ITEMS TABLE =====
  const tableData = invoice.items.map((item, i) => {
    const itemTax = ((item.qty * item.rate) * (invoice.gstRate || 0)) / 100;
    const itemTotal = item.qty * item.rate + itemTax;
    return [
      i + 1,
      item.name,
      item.qty,
      `₹${item.rate.toFixed(2)}`,
      `${invoice.gstRate || 0}%`,
      `₹${itemTotal.toFixed(2)}`
    ];
  });

  autoTable(doc, {
    startY: 170,
    head: [["#", "Item", "Qty", "Rate", "GST", "Total"]],
    body: tableData,
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 11 },
    styles: { fontSize: 10 },
    margin: { left: 40, right: 40 },
  });

  // ===== TOTALS =====
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, 400, finalY);
  doc.text(`GST: ₹${invoice.tax.toFixed(2)}`, 400, finalY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: ₹${invoice.total.toFixed(2)}`, 400, finalY + 35);

  // ===== FOOTER =====
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", 40, 780);

  // Save PDF
  doc.save(`${invoice.id}.pdf`);
};
