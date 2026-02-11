import { useState } from 'react';

const OverviewTab = ({ customer, onUpdate }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState(customer);

  const handleSave = () => {
    onUpdate?.(data);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setData(customer);
    setIsEdit(false);
  };

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* CUSTOMER INFO */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Customer Info</h3>
          {!isEdit && (
            <button
              onClick={() => setIsEdit(true)}
              className="text-sm text-blue-600"
            >
              Edit
            </button>
          )}
        </div>

        <p>
          Email:{' '}
          {isEdit ? (
            <input
              className="border px-2 py-1 rounded text-sm"
              value={data.email || ''}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
          ) : (
            customer.email
          )}
        </p>

        <p>
          Phone:{' '}
          {isEdit ? (
            <input
              className="border px-2 py-1 rounded text-sm"
              value={data.phone || ''}
              onChange={e => setData({ ...data, phone: e.target.value })}
            />
          ) : (
            customer.phone
          )}
        </p>

        <p>
          GSTIN:{' '}
          {isEdit ? (
            <input
              className="border px-2 py-1 rounded text-sm"
              value={data.gstin || ''}
              onChange={e => setData({ ...data, gstin: e.target.value })}
            />
          ) : (
            customer.gstin
          )}
        </p>

        <p>
          Address:{' '}
          {isEdit ? (
            <input
              className="border px-2 py-1 rounded text-sm w-64"
              value={data.billingAddress || ''}
              onChange={e =>
                setData({ ...data, billingAddress: e.target.value })
              }
            />
          ) : (
            customer.billingAddress
          )}
        </p>
      </div>

      {/* FINANCIALS */}
      <div>
        <h3 className="font-bold mb-2">Financials</h3>

        <p>
          Credit Limit: ₹
          {isEdit ? (
            <input
              type="number"
              className="border px-2 py-1 rounded text-sm w-28"
              value={data.creditLimit || 0}
              onChange={e =>
                setData({ ...data, creditLimit: +e.target.value })
              }
            />
          ) : (
            customer.creditLimit
          )}
        </p>

        <p>
  Outstanding: ₹
  <span className="font-semibold text-red-600">
    {customer.outstanding ?? 0}
  </span>
</p>


        <p>
          Payment Terms:{' '}
          {isEdit ? (
            <input
              className="border px-2 py-1 rounded text-sm"
              value={data.paymentTerms || ''}
              onChange={e =>
                setData({ ...data, paymentTerms: e.target.value })
              }
            />
          ) : (
            customer.paymentTerms
          )}
        </p>

        {isEdit && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="border px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* SALES HISTORY – NO CHANGE */}
      <div className="col-span-2">
        <h3 className="font-bold mb-2">Sales History</h3>

        {customer.salesHistory?.length ? (
          <table className="w-full border text-sm">
            <tbody>
              {customer.salesHistory.map(s => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.date}</td>
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">₹{s.amount}</td>
                  <td className="p-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500">No sales yet</p>
        )}
      </div>

    </div>
  );
};

export default OverviewTab;
