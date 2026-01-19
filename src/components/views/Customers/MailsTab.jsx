import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const MailsTab = ({ customer }) => {
  const [to, setTo] = useState(customer?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!to || !subject || !message) {
      alert('Please fill all fields');
      return;
    }

    setSending(true);
    setSent(false);

    // Fake send delay (real mail mathiri)
    setTimeout(() => {
      setSending(false);
      setSent(true);

      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow p-6">

      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Mail size={18} />
        Send Mail to Customer
      </h3>

      {/* TO */}
      <div className="mb-4">
        <label className="text-sm text-slate-500">To</label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="customer@email.com"
        />
      </div>

      {/* SUBJECT */}
      <div className="mb-4">
        <label className="text-sm text-slate-500">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="Invoice / Payment Reminder"
        />
      </div>

      {/* MESSAGE */}
      <div className="mb-4">
        <label className="text-sm text-slate-500">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="Write your message here..."
        />
      </div>

      {/* ACTION */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {sending ? 'Sending...' : 'Send Mail'}
        </button>

        {sent && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={16} />
            Mail sent successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default MailsTab;
