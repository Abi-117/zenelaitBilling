import { useState } from "react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="border rounded px-3 py-2"
    />
  </div>
);

const CustomerForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gstin: "",
    billingAddress: "",
    creditLimit: 0,
    paymentTerms: "Net 30",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email) return;

    onSave({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      gstin: formData.gstin,
      billingAddress: formData.billingAddress,
      creditLimit: Number(formData.creditLimit),
      paymentTerms: formData.paymentTerms,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6">
      <InputField label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
      <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
      <InputField label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} />
      <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
      <InputField label="GSTIN" name="gstin" value={formData.gstin} onChange={handleChange} />
      <InputField label="Billing Address" name="billingAddress" value={formData.billingAddress} onChange={handleChange} />
      <InputField label="Credit Limit" type="number" name="creditLimit" value={formData.creditLimit} onChange={handleChange} />

      <div className="col-span-2 flex gap-3 mt-4">
        <button className="bg-emerald-600 text-white px-6 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
