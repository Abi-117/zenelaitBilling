import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImg from "../assets/logo-hover.png"; // adjust path if needed

export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  /* ================= LOGO ================= */
  doc.addImage(logoImg, "JPEG", 40, 30, 80, 50);

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0);
  doc.text("INVOICE", pageWidth - 100, 50, { align: "right" });

/* ================= CUSTOMER DETAILS ================= */
let customerY = 190;

doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Invoice To", 40, customerY);

customerY += 18;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);

if (invoice.customerName) {
  doc.text(`Name: ${invoice.customerName}`, 40, customerY);
  customerY += 14;
}

if (invoice.company) {
  doc.text(`Company: ${invoice.company}`, 40, customerY);
  customerY += 14;
}

if (invoice.customerEmail) {
  doc.text(`Email: ${invoice.customerEmail}`, 40, customerY);
  customerY += 14;
}

if (invoice.customerPhone) {
  doc.text(`Phone: ${invoice.customerPhone}`, 40, customerY);
  customerY += 14;
}

if (invoice.gstin) {
  doc.text(`GSTIN: ${invoice.gstin}`, 40, customerY);
  customerY += 14;
}

if (invoice.customerAddress) {
  const addressLines = doc.splitTextToSize(
    `Address: ${invoice.customerAddress}`,
    260
  );
  doc.text(addressLines, 40, customerY);
  customerY += addressLines.length * 14;
}

  /* ================= BILL TO / INVOICE INFO ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Invoice To:", 40, 110);

  doc.setFont("helvetica", "normal");
  if (invoice.customerName) doc.text(invoice.customerName, 40, 125);
  if (invoice.customerEmail) doc.text(`Email: ${invoice.customerEmail}`, 40, 140);
  if (invoice.customerAddress) doc.text(invoice.customerAddress, 40, 155);
  if (invoice.gstin) doc.text(`GSTIN: ${invoice.gstin}`, 40, 170);

  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${invoice.invoiceNo || "—"}`, pageWidth - 200, 125);
  doc.text(`Date: ${invoice.date || "—"}`, pageWidth - 200, 140);

  /* ================= ITEMS TABLE ================= */
  const items = invoice.items || [];
  const tableData = items.map((item, index) => [
    index + 1,
    item.name || "-",
    item.qty,
    item.rate.toFixed(2),
    (item.qty * item.rate).toFixed(2),
  ]);

  autoTable(doc, {
    startY: 190,
    head: [["No", "Description", "Qty", "Rate", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [220, 53, 69], textColor: 255, fontStyle: "bold" },
    bodyStyles: { fontSize: 10 },
    styles: { cellPadding: 6 },
    margin: { left: 40, right: 40 },
  });

  /* ================= TOTALS ================= */
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const gstRate = invoice.gstRate || 0;
  const tax = (subtotal * gstRate) / 100;
  const total = subtotal + tax;
  const y = doc.lastAutoTable.finalY + 20;

  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", pageWidth - 160, y);
  doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - 40, y, { align: "right" });

  doc.text(`GST (${gstRate}%)`, pageWidth - 160, y + 18);
  doc.text(`₹${tax.toFixed(2)}`, pageWidth - 40, y + 18, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.line(pageWidth - 160, y + 28, pageWidth - 40, y + 28);
  doc.text("Total", pageWidth - 160, y + 45);
  doc.text(`₹${total.toFixed(2)}`, pageWidth - 40, y + 45, { align: "right" });

  /* ================= PAYMENT TERMS ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Payment Terms:", 40, y + 80);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(invoice.paymentTerms || "Payment via Bank Transfer / UPI / other mutually agreed method.", 40, y + 95);

  /* ================= BANK DETAILS ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Bank Details:", 40, y + 130);

  doc.setFont("helvetica", "normal");
  const bank = invoice.bankDetails || {};
  doc.text(`Account Type: ${bank.type || "-"}`, 40, y + 145);
  doc.text(`Account Number: ${bank.number || "-"}`, 40, y + 160);
  doc.text(`Account Name: ${bank.name || "-"}`, 40, y + 175);
  doc.text(`Bank IFSC: ${bank.ifsc || "-"}`, 40, y + 190);
  doc.text(`Bank Name: ${bank.bankName || "-"}`, 40, y + 205);
  doc.text(`Branch Name: ${bank.branch || "-"}`, 40, y + 220);

  /* ================= TERMS & CONDITIONS ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions:", 40, y + 245);

  doc.setFont("helvetica", "normal");
  const tnc = invoice.terms || [
    "Payments can be made via Bank Transfer, UPI, or any mutually agreed method.",
    "Project delivery after receiving the initial advance and required materials.",
  ];
  tnc.forEach((line, idx) => doc.text(`• ${line}`, 40, y + 260 + idx * 15));

  /* ================= SIGNATURE ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Authorised Signature", pageWidth - 200, y + 320);
  doc.text("(Founder – Zenelait Info Tech)", pageWidth - 200, y + 335);

  /* ================= SAVE ================= */
  doc.save(`${invoice.invoiceNo || "invoice"}.pdf`);
};
