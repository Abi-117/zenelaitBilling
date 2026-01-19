/* ---------------- UPGRADES ---------------- */
import { useState } from 'react';
import { Plus, FileText, Edit, Trash2, Mail } from 'lucide-react'; // Added Mail icon
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import InvoiceEditorPanel from '../sales/InvoiceEditorView';
import ProjectsView from '../../components/views/TimeTracking/ProjectsView';
import SendInvoicePage from '../sales/SendInvoicePage'; // <-- Import SendInvoicePage

const EstimatesView = () => {
  const [estimates, setEstimates] = useState([
    { id: 'EST-9110', customer: 'Anissa', amount: 373, status: 'Expired', date: '2025-12-05', items: [] },
    { id: 'EST-99439', customer: 'Theresia', amount: 403, status: 'Expired', date: '2026-01-02', items: [] },
    { id: 'EST-94964', customer: 'Darrin', amount: 467, status: 'Invoiced', date: '2025-12-03', items: [] },
    { id: 'EST-60533', customer: 'Kennedi', amount: 521, status: 'Invoiced', date: '2025-05-13', items: [] },
    { id: 'EST-12345', customer: 'Liam', amount: 320, status: 'Pending', date: '2026-01-10', items: [] },
    { id: 'EST-12346', customer: 'Olivia', amount: 275, status: 'Expired', date: '2025-11-28', items: [] },
    { id: 'EST-12347', customer: 'Noah', amount: 610, status: 'Invoiced', date: '2025-12-15', items: [] },
    { id: 'EST-12348', customer: 'Emma', amount: 455, status: 'Pending', date: '2026-01-05', items: [] },
    { id: 'EST-12349', customer: 'Ava', amount: 390, status: 'Expired', date: '2025-12-20', items: [] },
    { id: 'EST-12350', customer: 'William', amount: 500, status: 'Invoiced', date: '2025-12-30', items: [] },
    { id: 'EST-12351', customer: 'Sophia', amount: 420, status: 'Pending', date: '2026-01-08', items: [] },
    { id: 'EST-12352', customer: 'James', amount: 350, status: 'Expired', date: '2025-12-12', items: [] },
    { id: 'EST-12353', customer: 'Isabella', amount: 480, status: 'Invoiced', date: '2025-12-25', items: [] },
    { id: 'EST-12354', customer: 'Benjamin', amount: 540, status: 'Pending', date: '2026-01-03', items: [] },
    { id: 'EST-12355', customer: 'Mia', amount: 395, status: 'Expired', date: '2025-12-18', items: [] }
  ]);

  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [creatingInvoice, setCreatingInvoice] = useState(null);
  const [creatingProject, setCreatingProject] = useState(null);
  const [showNewEstimateModal, setShowNewEstimateModal] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState(null);
  
  // ---------------- SEND INVOICE MODAL ----------------
  const [sendInvoiceModal, setSendInvoiceModal] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(null);

  /* ---------------- CONVERT TO INVOICE ---------------- */
  const handleConvertInvoice = (estimate) => {
    setSelectedEstimate(null);
    setCreatingProject(null);
    setCreatingInvoice({
      id: `INV-${Date.now()}`,
      customerName: estimate.customer,
      date: new Date().toISOString().split('T')[0],
      items: estimate.items || [],
      gstRate: 18,
      gstin: '',
      subtotal: 0,
      tax: 0,
      total: estimate.amount,
    });
  };

  /* ---------------- CREATE PROJECT ---------------- */
  const handleCreateProject = (estimate) => {
    setSelectedEstimate(null);
    setCreatingInvoice(null);
    setCreatingProject({
      name: `Project for ${estimate.customer}`,
      client: estimate.customer,
      rate: estimate.amount,
    });
  };

  /* ---------------- ADD OR EDIT ESTIMATE ---------------- */
  const handleSaveNewEstimate = (newEstimate) => {
    setEstimates(prev => [{ id: `EST-${Date.now()}`, ...newEstimate }, ...prev]);
    setShowNewEstimateModal(false);
  };

  const handleSaveEditedEstimate = (updated) => {
    setEstimates(prev => prev.map(e => e.id === updated.id ? updated : e));
    setEditingEstimate(null);
  };

  /* ---------------- SEND INVOICE ---------------- */
  const handleOpenSendInvoice = (estimate) => {
    setSendingInvoice(estimate);
    setSendInvoiceModal(true);
  };

  const handleSendInvoice = ({ invoiceId, status, ...rest }) => {
    // Update the invoice status in estimates array
    setEstimates(prev =>
      prev.map(e =>
        e.id === invoiceId
          ? { ...e, status: status || e.status }
          : e
      )
    );
    setSendInvoiceModal(false);
    setSendingInvoice(null);
    alert('Invoice sent successfully!');
  };

  /* ---------------- CONDITIONAL SCREENS ---------------- */
  if (creatingInvoice) {
    return (
      <InvoiceEditorPanel
        invoice={creatingInvoice}
        onChange={setCreatingInvoice}
        onBack={() => setCreatingInvoice(null)}
        onSave={() => {
          alert('Invoice created successfully');
          setCreatingInvoice(null);
        }}
      />
    );
  }

  if (creatingProject) {
    return (
      <ProjectsView
        initialProject={creatingProject}
        onBack={() => setCreatingProject(null)}
      />
    );
  }

  /* ---------------- MAIN VIEW ---------------- */
  return (
    <div className="flex gap-6 p-6">

      {/* LEFT TABLE */}
      <div className="w-2/3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Estimates</h2>
          <button
            onClick={() => setShowNewEstimateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} /> New Estimate
          </button>
        </div>

        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map(est => (
                <tr
                  key={est.id}
                  className={`border-t cursor-pointer hover:bg-slate-50 ${selectedEstimate?.id === est.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedEstimate(est)}
                >
                  <td className="p-3 flex items-center gap-2">
                    <FileText size={14} /> {est.id}
                  </td>
                  <td className="p-3">{est.customer}</td>
                  <td className="p-3 text-right font-bold">₹{est.amount}</td>
                  <td className="p-3">{est.date}</td>
                  <td className={`p-3 text-center ${est.status === 'Expired' ? 'text-red-600 font-semibold' : ''}`}>
                    {est.status}
                  </td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSendInvoice(est); // <-- Send Invoice
                      }}
                      className="text-green-600"
                      title="Send Invoice"
                    >
                      <Mail size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEstimate(est);
                      }}
                      className="text-blue-600"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEstimates(estimates.filter(x => x.id !== est.id));
                      }}
                      className="text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* RIGHT DETAIL PANEL */}
      {selectedEstimate && (
        <div className="w-1/3 bg-white rounded-xl shadow p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{selectedEstimate.id}</h3>
            <button onClick={() => setSelectedEstimate(null)}>Close</button>
          </div>

          <p className="text-slate-600">{selectedEstimate.customer}</p>
          <p className="font-bold text-lg">₹{selectedEstimate.amount}</p>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => handleConvertInvoice(selectedEstimate)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Convert to Invoice
            </button>
            <button
              onClick={() => handleCreateProject(selectedEstimate)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {/* ---------------- NEW ESTIMATE MODAL ---------------- */}
      <Modal
        isOpen={showNewEstimateModal}
        onClose={() => setShowNewEstimateModal(false)}
        title="New Estimate"
      >
        <NewEstimateForm
          onCancel={() => setShowNewEstimateModal(false)}
          onSave={handleSaveNewEstimate}
        />
      </Modal>

      {/* ---------------- EDIT ESTIMATE MODAL ---------------- */}
      <Modal
        isOpen={!!editingEstimate}
        onClose={() => setEditingEstimate(null)}
        title={`Edit ${editingEstimate?.id}`}
      >
        {editingEstimate && (
          <NewEstimateForm
            initial={editingEstimate}
            onCancel={() => setEditingEstimate(null)}
            onSave={handleSaveEditedEstimate}
          />
        )}
      </Modal>

      {/* ---------------- SEND INVOICE MODAL ---------------- */}
      {sendInvoiceModal && sendingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-6 z-50 overflow-auto">
          <SendInvoicePage
            invoice={sendingInvoice}
            onSendInvoice={handleSendInvoice}
            onBack={() => setSendInvoiceModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EstimatesView;

/* ---------------- NEW/EDIT ESTIMATE FORM ---------------- */
const NewEstimateForm = ({ onSave, onCancel, initial }) => {
  const [form, setForm] = useState(initial || {
    customer: '',
    amount: 0,
    status: 'Draft',
    date: new Date().toISOString().split('T')[0],
    items: [],
  });

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Customer Name"
        className="w-full border p-2 rounded"
        value={form.customer}
        onChange={e => setForm({ ...form, customer: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount"
        className="w-full border p-2 rounded"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
      />
      <input
        type="date"
        className="w-full border p-2 rounded"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
      />

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};
