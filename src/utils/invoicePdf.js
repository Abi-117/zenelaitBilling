import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ IMPORTANT

export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF();

  /* ===== HEADER ===== */
  doc.setFontSize(18);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoice.id}`, 14, 30);
  doc.text(`Date: ${invoice.date}`, 14, 36);
  doc.text(`Status: ${invoice.status}`, 14, 42);

  /* ===== CUSTOMER ===== */
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 54);
  doc.text(invoice.customerName, 14, 60);

  /* ===== TABLE ===== */
  autoTable(doc, {
    startY: 70,
    head: [["#", "Item", "Qty", "Rate", "GST", "Total"]],
    body: invoice.items.map((item, i) => [
      i + 1,
      item.name,
      item.qty,
      `₹${item.rate}`,
      `${item.tax}%`,
      `₹${item.total}`
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] }
  });

  /* ===== TOTALS ===== */
  const y = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: ₹${invoice.subtotal}`, 140, y);
  doc.text(`GST: ₹${invoice.taxAmount}`, 140, y + 6);
  doc.setFontSize(13);
  doc.text(`Grand Total: ₹${invoice.total}`, 140, y + 14);

  /* ===== FOOTER ===== */
  doc.setFontSize(9);
  doc.text("Thank you for your business!", 14, 285);

  doc.save(`${invoice.id}.pdf`);
};
