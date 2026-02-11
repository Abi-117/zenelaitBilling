import { useState } from "react";
import { createTimesheet, deleteTimesheet } from "../../../services/timeTrackingApi";
import { generateInvoiceFromTimesheets } from "../../../services/invoiceApi";
import InvoiceEditorView from "../../sales/InvoiceEditorView";

const TimesheetsView = ({ projects = [], timesheets = [], reload }) => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");
  const [billable, setBillable] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showInvoiceBox, setShowInvoiceBox] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const [editingInvoice, setEditingInvoice] = useState(null);

  /* ================= SAVE MANUAL TIMESHEET ================= */
  const saveManual = async () => {
    if (!selectedProjectId || !hours) return alert("Select project & hours");
    const project = projects.find(p => p._id === selectedProjectId);
    if (!project) return;

    const h = Number(hours);
    const payload = {
      project: project._id,
      task: task || "-",
      hours: h,
      billable,
      rate: billable ? project.rate : 0,
      amount: billable ? project.rate * h : 0,
      date: new Date(),
      source: "Manual",
      invoiced: false,
    };

    try {
      setSaving(true);
      await createTimesheet(payload);
      setTask(""); setHours(""); setSelectedProjectId(""); setBillable(true);
      reload();
    } finally { setSaving(false); }
  };

  /* ================= DELETE TIMESHEET ================= */
  const removeTimesheet = async id => {
    if (!confirm("Delete this entry?")) return;
    await deleteTimesheet(id);
    reload();
  };

  /* ================= GENERATE INVOICE & OPEN EDITOR ================= */
  const generateInvoice = async () => {
    if (!selectedProjectId || !fromDate || !toDate)
      return alert("Select project & date range");

    try {
      setGenerating(true);
      const res = await generateInvoiceFromTimesheets({
        projectId: selectedProjectId,
        fromDate,
        toDate,
        customerName: "Client",
      });

      const invoiceData = res.data;

      setEditingInvoice({
        ...invoiceData,
        customerId: "", // optional mapping
      });

      setShowInvoiceBox(false);
      setFromDate(""); setToDate("");
      reload();
    } finally { setGenerating(false); }
  };

  /* ================= TOTALS ================= */
  const totalHours = timesheets.reduce((a, b) => a + Number(b.hours || 0), 0);
  const totalAmount = timesheets.reduce((a, b) => a + Number(b.amount || 0), 0);

  /* ================= SAVE FROM INVOICE EDITOR ================= */
  const handleSaveInvoice = (updatedInvoice) => {
    console.log("Invoice ready to save:", updatedInvoice);
    // call your backend API to save invoice here
    setEditingInvoice(null);
    reload();
  };

  /* ================= RENDER ================= */
  if (editingInvoice) {
    return (
      <InvoiceEditorView
        invoice={editingInvoice}
        customers={[]} // optionally pass customers
        onChange={setEditingInvoice}
        onBack={() => setEditingInvoice(null)}
        onSave={handleSaveInvoice}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Timesheets</h2>
        <div className="text-sm text-slate-600">
          Total Hours: <b>{totalHours}</b> | Billable: <b>₹{totalAmount}</b>
        </div>
      </div>

      {/* ===== GENERATE INVOICE BOX ===== */}
      <div className="bg-white p-4 rounded-xl border space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Generate Invoice</h3>
          <button
            onClick={() => setShowInvoiceBox(!showInvoiceBox)}
            className="text-sm text-blue-600"
          >
            {showInvoiceBox ? "Hide" : "Generate"}
          </button>
        </div>

        {showInvoiceBox && (
          <div className="grid grid-cols-4 gap-3 items-end">
            <select
              className="input"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <input type="date" className="input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <input type="date" className="input" value={toDate} onChange={e => setToDate(e.target.value)} />

            <button
              onClick={generateInvoice}
              disabled={generating}
              className={`bg-emerald-600 text-white rounded-lg py-2 ${generating ? "opacity-60" : ""}`}
            >
              {generating ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        )}
      </div>

      {/* ===== MANUAL ENTRY ===== */}
      <div className="bg-white rounded-xl p-4 border grid grid-cols-6 gap-3 items-end">
        <select
          className="input"
          value={selectedProjectId}
          onChange={e => setSelectedProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <input className="input" placeholder="Task / Description" value={task} onChange={e => setTask(e.target.value)} />
        <input type="number" step="0.1" className="input" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={billable} onChange={e => setBillable(e.target.checked)} />
          Billable
        </label>

        <button
          disabled={saving}
          onClick={saveManual}
          className={`bg-blue-600 text-white rounded-lg font-semibold py-2 ${saving ? "opacity-60" : ""}`}
        >
          Add Entry
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th>Date</th><th>Project</th><th>Task</th><th>Hours</th>
              <th>Billable</th><th>Rate</th><th>Amount</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {timesheets.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-slate-400">No timesheets added</td>
              </tr>
            ) : timesheets.map(t => (
              <tr key={t._id} className="border-t">
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.project?.name || "-"}</td>
                <td>{t.task}</td>
                <td>{t.hours}</td>
                <td className={t.billable ? "text-emerald-600" : "text-slate-400"}>{t.billable ? "Yes" : "No"}</td>
                <td>₹{t.rate}</td>
                <td>₹{t.amount}</td>
                <td>{t.invoiced ? "Invoiced" : "Pending"}</td>
                <td>{!t.invoiced && <button onClick={() => removeTimesheet(t._id)} className="text-red-600 text-xs">Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimesheetsView;
