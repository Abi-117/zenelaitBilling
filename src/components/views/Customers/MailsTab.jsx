import { Mail, Paperclip, Send } from 'lucide-react';

const MOCK_MAILS = [
  {
    id: 1,
    subject: 'Invoice INV-108 Sent',
    to: 'billing@customer.com',
    date: '20 Jan 2026',
    status: 'Sent',
    body: 'Invoice INV-108 for ₹42,000 has been sent successfully.',
    attachments: ['INV-108.pdf'],
  },
  {
    id: 2,
    subject: 'Payment Reminder',
    to: 'billing@customer.com',
    date: '15 Jan 2026',
    status: 'Delivered',
    body: 'This is a reminder regarding overdue invoice INV-102.',
    attachments: [],
  },
];

const MailsTab = () => {
  return (
    <div className="space-y-6 text-sm">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Mails</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Send size={14} />
          Send Mail
        </button>
      </div>

      {/* Mail List */}
      {MOCK_MAILS.length > 0 ? (
        <div className="space-y-3">
          {MOCK_MAILS.map(mail => (
            <div
              key={mail.id}
              className="border rounded-lg p-4 bg-white hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-slate-800">
                    {mail.subject}
                  </p>
                  <p className="text-xs text-slate-500">
                    To: {mail.to}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <p className="text-slate-400">{mail.date}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      mail.status === 'Sent'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {mail.status}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-slate-600">
                {mail.body}
              </p>

              {mail.attachments.length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Paperclip size={12} />
                  {mail.attachments.map((file, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 px-2 py-1 rounded"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Mail size={32} />
          <p className="mt-2 font-medium">No emails sent yet</p>
          <p className="text-xs">
            Emails related to invoices and reminders will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default MailsTab;
