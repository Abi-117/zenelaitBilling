"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Badge from "../../../ui/Badge";
import Card from "../../../ui/Card";
import Button from "../../../ui/button";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PaymentsReceivedView() {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Pending");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/payments`);
      const data = res.data || [];

      setPayments(data);

      const pending = data.find(p => p.status === "Pending");
      if (pending) setSelected(pending);
    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selected) return;

    if (!confirm("Are you sure you want to refund this payment?")) return;

    try {
      await axios.post(
        `${API_BASE_URL}/payments/${selected._id}/refund`
      );

      alert("Refund successful");
      fetchPayments();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Refund failed");
    }
  };

  const filteredPayments =
    filterStatus === "All"
      ? payments
      : payments.filter(p => p.status === filterStatus);

  const getStatusColor = status => {
    switch (status) {
      case "Completed":
        return "bg-green-600";
      case "Pending":
        return "bg-yellow-500";
      case "Failed":
        return "bg-red-600";
      case "Refunded":
        return "bg-purple-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT LIST */}
      <div className="col-span-5">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Payments Received</h2>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="All">All</option>
            </select>
          </div>

          {loading && <p>Loading...</p>}

          {!loading && filteredPayments.length === 0 && (
            <p className="text-sm text-gray-500">No payments found</p>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredPayments.map(payment => (
              <div
                key={payment._id}
                onClick={() => setSelected(payment)}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selected?._id === payment._id ? "border-blue-600" : ""
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {payment.customerId?.name || "Unknown Customer"}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{payment.amount}
                    </p>
                  </div>

                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* RIGHT DETAILS */}
      <div className="col-span-7">
        {selected ? (
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              Payment Details
            </h2>

            <div className="space-y-4">
              <Detail
                label="Customer"
                value={selected.customerId?.name || "-"}
              />
              <Detail
                label="Email"
                value={selected.customerId?.email || "-"}
              />
              <Detail
                label="Amount"
                value={`₹${selected.amount}`}
              />
              <Detail
                label="Razorpay Payment ID"
                value={selected.razorpayPaymentId || "-"}
              />
              <Detail
                label="Razorpay Order ID"
                value={selected.razorpayOrderId || "-"}
              />
              <Detail label="Status" value={selected.status} />

              {selected.status === "Completed" && (
                <Button variant="destructive" onClick={handleRefund}>
                  Refund Payment
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <p className="text-gray-500 text-sm">
            Select a payment to view details
          </p>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
