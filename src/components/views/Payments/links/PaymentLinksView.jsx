import { useEffect, useState } from "react";
import API from "../../../../config/api";
import PaymentLinkDetails from "./PaymentLinkDetails";

const PaymentLinksView = () => {
  const [links, setLinks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const res = await API.get("/payment-links");
        setLinks(res.data || []);
        if (res.data?.length > 0) {
          setSelected(res.data[0]);
        }
      } catch (err) {
        console.error("Payment links error", err);
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  if (loading) {
    return <div className="p-6">Loading payment links...</div>;
  }

  if (links.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400">
        No payment links found
      </div>
    );
  }

  return (
    <div className="flex border rounded-xl bg-white h-[650px]">
      {/* LEFT LIST */}
      <div className="w-2/3 border-r overflow-auto">
        {links.map(l => (
          <div
            key={l._id}
            onClick={() => setSelected(l)}
            className={`p-4 border-b cursor-pointer ${
              selected?._id === l._id ? "bg-blue-50" : ""
            }`}
          >
            <p className="font-semibold">{l.customerName}</p>
            <p className="text-xs text-slate-500">{l.linkId}</p>
            <p className="font-bold">₹{l.amount}</p>
          </div>
        ))}
      </div>

      {/* RIGHT DETAILS */}
      <div className="w-1/3">
        {selected ? (
          <PaymentLinkDetails data={selected} />
        ) : (
          <div className="p-6 text-slate-400">
            Select a payment link
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLinksView;
